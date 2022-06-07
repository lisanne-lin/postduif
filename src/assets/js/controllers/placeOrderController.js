/**
 * Controller voor place order
 * @author Simon Vriesema
 */

import {Controller} from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";

export class PlaceOrderController extends Controller {
    #placeOrderView;
    #ordersRepository;

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#setupView();
    }

    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);

        this.#placeOrderView = await super.loadHtmlIntoContent("html_views/place_order.html");

        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link active";

        this.#placeOrderView.querySelector("#saveButton").addEventListener("click",
            (event) => this.#saveOrder(event));

    }

    async #sendMail(emailadres, naam, bestelnummer) {
        await fetch("https://api.hbo-ict.cloud/mail", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer pad_rit_9.YRbTwIUUBpasHZ2x'
            },
            body: JSON.stringify({
                "from": {
                    "name": "Team postDuif ",
                    "address": "group@hbo-ict.cloud"
                },
                "to": [
                    {
                        "name": naam,
                        "address": emailadres
                    }
                ],
                "subject": "Track & Trace: " + bestelnummer,
                "html": "Dear " + naam + ",\n\nIn order to track your order, you will need to enter this Track & Trace code on the postDuif website: " + bestelnummer +
                    ". \n" +
                    "Kind regards,\n" +
                    "\n" +
                    "Team postDuif"
            })
        })
    }

    async #saveOrder(event) {
        event.preventDefault();

        const naam = this.#placeOrderView.querySelector("#exampleInputName").value;
        const emailadres = this.#placeOrderView.querySelector("#exampleInputEmail").value;
        const adres = this.#placeOrderView.querySelector("#exampleInputAdres").value;
        const plaats = this.#placeOrderView.querySelector("#exampleInputPlaats").value;
        const postcode = this.#placeOrderView.querySelector("#exampleInputPostcode").value;
        const geschatte_bezorgdatum = this.#placeOrderView.querySelector("#exampleInputBezorgdatum").value;
        const verzend_datum = this.#placeOrderView.querySelector("#exampleInputVerzenddatum").value;
        const prijs = this.#placeOrderView.querySelector("#exampleInputStatus").value;
        const bezorgkosten = this.#placeOrderView.querySelector("#exampleInputBezorgkosten").value;

        const errorBox = this.#placeOrderView.querySelector("#error-box");

        const adresRegex = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;
        const postcodeRegex = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;

        let date;

        if (naam == "" || naam == " " || naam == null) {
            errorBox.innerHTML = "Name is too short or not entered correctly"
        } else if (!adresRegex.test(adres)) {
            errorBox.innerHTML = "Adress is not entered correctly"
        } else if (plaats == "" || plaats == null) {
            errorBox.innerHTML = "Please choose a place"
        } else if (!postcodeRegex.test(postcode)) {
            errorBox.innerHTML = "Zip is too short or not entered correctly"
        } else if (geschatte_bezorgdatum == null || geschatte_bezorgdatum == "") {
            errorBox.innerHTML = "Please choose an estimated delivery date"
        } else if (verzend_datum == null || verzend_datum == "") {
            errorBox.innerHTML = "Please choose a shipping date"
        } else if (prijs == null || prijs == 0) {
            errorBox.innerHTML = "Please choose the price of the order"
        } else if (bezorgkosten == null || bezorgkosten == 0) {
            errorBox.innerHTML = "Please choose the delivery costs, delivery guys want to earn money too..."
        } else {
            date = new Date();

            date = date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2);

            const createOrder = await this.#ordersRepository.createOrder(null, naam, adres, plaats, postcode, geschatte_bezorgdatum,
                verzend_datum, bezorgkosten, null, null, null,
                1, date, null, prijs);

            this.#placeOrderView.querySelector("#saveButton").style.display = "none";
            this.#placeOrderView.querySelector("#loadingBtn").style.display = "block";

            this.#sendMail(emailadres, naam, createOrder.bestelnummer);

            setTimeout(function () {
                App.loadController(App.CONTROLLER_ORDERS)
            }, 2000);
        }
    }
}
