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

        const naam = this.#placeOrderView.querySelector("#exampleInputName").value;
        const adres = this.#placeOrderView.querySelector("#exampleInputAdres").value;
        const plaats = this.#placeOrderView.querySelector("#exampleInputPlaats").value;
        const postcode = this.#placeOrderView.querySelector("#exampleInputPostcode").value;
        const geschatte_bezorgdatum = this.#placeOrderView.querySelector("#exampleInputBezorgdatum").value;
        const verzend_datum = this.#placeOrderView.querySelector("#exampleInputVerzenddatum").value;
        const prijs = this.#placeOrderView.querySelector("#exampleInputStatus").value;
        const bezorgkosten = this.#placeOrderView.querySelector("#exampleInputBezorgkosten").value;

        const errorBox = this.#placeOrderView.querySelector(".error");

        const adresRegex = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;
        const postcodeRegex = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;

        let errorMessage = "";

        let date;

        date = new Date();

        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);

        errorBox.innerHTML = errorMessage;
        this.#ordersRepository.createOrder(null, naam, adres, plaats, postcode, geschatte_bezorgdatum,
            verzend_datum, bezorgkosten, null, null, null,
            1, date, null, prijs);

        this.#placeOrderView.querySelector("#saveButton").disabled = true;
        this.#placeOrderView.querySelector("#spinner").style.display = "block";
    }

}
