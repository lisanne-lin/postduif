/**
 * Controller voor place order
 * @author Simon Vriesema
 */

import {Controller} from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class PlaceOrderController extends Controller {
    #placeOrderView;
    #ordersRepository;
    #entrepreneursRepository;
    #ID;

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setupView();
    }

    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
        const ENTREPRENEUR_ID = await this.#entrepreneursRepository.getUserIdByEmail(App.sessionManager.get("username"))
        this.#ID = ENTREPRENEUR_ID[0].entrepreneur_id;

        this.#placeOrderView = await super.loadHtmlIntoContent("html_views/place_order.html");

        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").classNAME = "nav-link active";

        this.#placeOrderView.querySelector("#saveButton").addEventListener("click",
            (event) => this.#saveOrder(event));

    }

    async #sendMail(emailaddress, name, order_id, ZIP) {
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
                        "name": name,
                        "address": emailaddress
                    }
                ],
                "subject": "Track & Trace: " + order_id,
                "html": "Dear " + name + ",\n\nIn order to track your order, you will need to enter this Track & Trace code on the postDuif website: " + order_id +
                    ", and your ZIP: " + ZIP +
                    ". Kind regards,\n" +
                    "\n" +
                    "Team postDuif"
            })
        })
    }


    async #saveOrder(event) {
        event.preventDefault();

        const NAME = this.#placeOrderView.querySelector("#exampleInputName").value;
        const EMAILADDRES = this.#placeOrderView.querySelector("#exampleInputEmail").value;
        const ADDRESS = this.#placeOrderView.querySelector("#exampleInputAdres").value;
        const PLACE = this.#placeOrderView.querySelector("#exampleInputPlaats").value;
        const ZIP = this.#placeOrderView.querySelector("#exampleInputPostcode").value;
        const ESTIMATED_DELIVERY = this.#placeOrderView.querySelector("#exampleInputBezorgdatum").value;
        const SHIPPING_DATE = this.#placeOrderView.querySelector("#exampleInputVerzenddatum").value;
        const PRICE = this.#placeOrderView.querySelector("#exampleInputStatus").value;
        const DELIVERY_CHARGE = this.#placeOrderView.querySelector("#exampleInputBezorgkosten").value;
        const REMARK = this.#placeOrderView.querySelector("#exampleRemark").value;

        const ERROR_BOX = this.#placeOrderView.querySelector("#error-box");

        const ADDRESSS_REGEX = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;
        const ZIP_REGEX = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
        
        if (NAME == "" || NAME == " " || NAME == null) {
            ERROR_BOX.innerHTML = "Name is too short or not entered correctly"
        } else if (!ADDRESSS_REGEX.test(ADDRESS)) {
            ERROR_BOX.innerHTML = "Addres is not entered correctly"
        } else if (PLACE == "" || PLACE == null) {
            ERROR_BOX.innerHTML = "Please choose a place"
        } else if (!ZIP_REGEX.test(ZIP)) {
            ERROR_BOX.innerHTML = "Zip is too short or not entered correctly"
        } else if (ESTIMATED_DELIVERY == null || ESTIMATED_DELIVERY == "") {
            ERROR_BOX.innerHTML = "Please choose an estimated delivery date"
        } else if (SHIPPING_DATE == null || SHIPPING_DATE == "") {
            ERROR_BOX.innerHTML = "Please choose a shipping date"
        } else if (PRICE == null || PRICE == 0) {
            ERROR_BOX.innerHTML = "Please choose the PRICE of the order"
        } else if (DELIVERY_CHARGE == null || DELIVERY_CHARGE == 0) {
            ERROR_BOX.innerHTML = "Please choose the delivery costs, delivery guys want to earn money too..."
        } else {
            let date = new Date();

            date = date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2);

            const createOrder = await this.#ordersRepository.createOrder(null, NAME, ADDRESS, PLACE, ZIP, ESTIMATED_DELIVERY,
                SHIPPING_DATE, DELIVERY_CHARGE, REMARK, null, null,
                this.#ID, date, null, PRICE);

            this.#placeOrderView.querySelector("#saveButton").style.display = "none";
            this.#placeOrderView.querySelector("#loadingBtn").style.display = "block";

            this.#sendMail(EMAILADDRES, NAME, createOrder.order_id, ZIP);

            setTimeout(function () {
                App.loadController(App.CONTROLLER_ORDERS)
            }, 2000);
        }
    }
}
