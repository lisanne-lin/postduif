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

    #saveOrder(event) {
        event.preventDefault();
        const klantnummer  = this.#placeOrderView.querySelector("#exampleInputKlantnummer").value;
        const naam  = this.#placeOrderView.querySelector("#exampleInputName").value;
        const adres  = this.#placeOrderView.querySelector("#exampleInputAdres").value;
        const plaats  = this.#placeOrderView.querySelector("#exampleInputPlaats").value;
        const postcode  = this.#placeOrderView.querySelector("#exampleInputPostcode").value;
        const geschatte_bezorgdatum  = this.#placeOrderView.querySelector("#exampleInputBezorgdatum").value;
        const verzend_datum  = this.#placeOrderView.querySelector("#exampleInputVerzenddatum").value;
        const status  = this.#placeOrderView.querySelector("#exampleInputStatus").value;
        const bezorgkosten  = this.#placeOrderView.querySelector("#exampleInputBezorgkosten").value;

        const errorBox = this.#placeOrderView.querySelector(".error");

        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
        console.log(date)

        if (naam.length < 2) {
            errorBox.innerHTML = "Naam is te kort, minimaal 2 karakters";
        } else {
            errorBox.innerHTML = "";
            this.#ordersRepository.createOrder(null, naam, adres, plaats, postcode, geschatte_bezorgdatum,
                verzend_datum, bezorgkosten, null,null, klantnummer,
                1, date, status);
        }
    }

}
