/**
 * @author Simon Vriesema
 * Controller for register/sign up
 */

import {Controller} from "./controller.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";
import {App} from "../app.js";

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

        document.querySelector(".navbar").style.display = "block";

        this.#registerView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#saveAccount(event));

        this.#registerView.querySelector("#login-btn").addEventListener("click",event => {
            App.loadController(event.target.dataset.controller)
        });
    }

    async #saveAccount(event) {
        event.preventDefault();

        const naamOnderneming = this.#registerView.querySelector("#exampleInputNaamOnderneming").value;
        const voornaam = this.#registerView.querySelector("#exampleInputNaamEigenaar").value;
        const achternaam = this.#registerView.querySelector("#exampleInputAchternaam").value;
        const volledigeNaam = voornaam + " " + achternaam;
        const email = this.#registerView.querySelector("#exampleInputEmail").value;
        const wachtwoord = this.#registerView.querySelector("#exampleInputPassword").value;
        const telefoonnummer = this.#registerView.querySelector("#exampleInputPhonenumber").value;
        const adres = this.#registerView.querySelector("#exampleInputAdress").value;
        const plaats = this.#registerView.querySelector("#exampleInputResidence").value;
        const postcode = this.#registerView.querySelector("#exampleInputPostcode").value;

        const errorBox = this.#registerView.querySelector(".error");

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Please enter a valid email address, example: john-doe@hotmale.com";
        } else if (naamOnderneming === null || naamOnderneming === "") {
            errorBox.innerHTML = "Company name can't be empty";
        } else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else {
            errorBox.innerHTML = "";
            await this.#entrepreneursRepository.createEntrepreneur(null, naamOnderneming, volledigeNaam,
                adres, plaats, postcode, telefoonnummer, email, wachtwoord);
            // App.loadController(App.CONTROLLER_WELCOME);
        }
    }

}