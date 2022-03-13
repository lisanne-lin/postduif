/**
 * @author Simon Vriesema
 * Controller for register/sign up
 */

import {Controller} from "./controller.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class RegisterController extends Controller {
    #registerView;
    #entrepreneursRepository;

    constructor() {
        super();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#registerView = await super.loadHtmlIntoContent("html_views/register.html")

        this.#registerView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#saveAccount(event));
    }

    #saveAccount(event) {
        event.preventDefault();

        const naamOnderneming = this.#registerView.querySelector("#exampleInputNaamOnderneming").value;
        const naamEigenaar = this.#registerView.querySelector("#exampleInputNaamEigenaar").value;
        const email = this.#registerView.querySelector("#exampleInputEmail").value;
        const wachtwoord = this.#registerView.querySelector("#exampleInputPassword").value;
        const herhaalWachtwoord = this.#registerView.querySelector("#exampleInputPassword").value;
        const telefoonnummer = this.#registerView.querySelector("#exampleInputPhonenumber").value;
        const adres = this.#registerView.querySelector("#exampleInputAdress").value;
        const plaats = this.#registerView.querySelector("#exampleInputResidence").value;
        const postcode = this.#registerView.querySelector("#exampleInputPostcode").value;

        const errorBox = this.#registerView.querySelector(".error");

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (wachtwoord === herhaalWachtwoord) {
            errorBox.innerHTML = "Wachtwoord is niet hetzelfde";
        } else if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Vul een geldig emailadres in, voorbeeld pieter_kaas@kaas.nl";
        } else if (naamOnderneming === null || naamOnderneming === "") {
            errorBox.innerHTML = "Naam van onderneming mag niet leeg zijn";
        } else {
            errorBox.innerHTML = "";
            this.#entrepreneursRepository.createEntrepreneur(null, naamOnderneming, naamEigenaar,
                adres, plaats, postcode, telefoonnummer, email, wachtwoord);
        }
    }

}