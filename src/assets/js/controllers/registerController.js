import { Controller } from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository";

export class RegisterController extends Controller {

    #registerView;
    #entrepreneursRepository;

    constructor()  {
        super();
        this.#entrepreneursRepository = new OrdersRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#placeOrderView = await super.loadHtmlIntoContent("html_views/register.html")

        this.#placeOrderView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#saveAccount(event));
    }

    #saveAccount(event) {
        event.preventDefault();

        // const bestelnummer  = this.#placeOrderView.querySelector("#exampleInputOrderNum").value;
        const klantnummer  = this.#placeOrderView.querySelector("#exampleInputKlantnummer").value;
        const naam  = this.#placeOrderView.querySelector("#exampleInputName").value;
        const adres  = this.#placeOrderView.querySelector("#exampleInputAdres").value;
        const plaats  = this.#placeOrderView.querySelector("#exampleInputPlaats").value;
        const postcode  = this.#placeOrderView.querySelector("#exampleInputPostcode").value;
        const geschatte_bezorgdatum  = this.#placeOrderView.querySelector("#exampleInputBezorgdatum").value;
        const verzend_datum  = this.#placeOrderView.querySelector("#exampleInputVerzenddatum").value;
        const bezorgkosten  = this.#placeOrderView.querySelector("#exampleInputBezorgkosten").value;

        const errorBox = this.#placeOrderView.querySelector(".error");

        if (naam.length < 2) {
            errorBox.innerHTML = "Naam is te kort, minimaal 2 karakters";
        } else {
            errorBox.innerHTML = "";
            this.#ordersRepository.createOrder(null, naam, adres, plaats, postcode, geschatte_bezorgdatum,
                verzend_datum, bezorgkosten, null,1, 1,
                1, null);
        }
    }

}