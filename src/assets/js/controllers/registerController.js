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
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);

        this.#registerView = await super.loadHtmlIntoContent(
            "html_views/register.html"
        );

        document.querySelector(".navbar").style.display = "block";

        this.#registerView
            .querySelector("#saveAccountBtn")
            .addEventListener("click", (event) => this.#saveAccount(event));

        this.#registerView
            .querySelector("#login-btn")
            .addEventListener("click", (event) => {
                App.loadController(event.target.dataset.controller);
            });
    }

    async #saveAccount(event) {
        event.preventDefault();

        const naamOnderneming = this.#registerView.querySelector(
            "#exampleInputNaamOnderneming"
        ).value;
        const voornaam = this.#registerView.querySelector(
            "#exampleInputNaamEigenaar"
        ).value;
        const achternaam = this.#registerView.querySelector(
            "#exampleInputAchternaam"
        ).value;
        const volledigeNaam = voornaam + " " + achternaam;
        const email =
            this.#registerView.querySelector("#exampleInputEmail").value;
        const wachtwoord = this.#registerView.querySelector(
            "#exampleInputPassword"
        ).value;
        const telefoonnummer = this.#registerView.querySelector(
            "#exampleInputPhonenumber"
        ).value;
        const adres = this.#registerView.querySelector(
            "#exampleInputAdress"
        ).value;
        const plaats = this.#registerView.querySelector(
            "#exampleInputResidence"
        ).value;
        const postcode = this.#registerView.querySelector(
            "#exampleInputPostcode"
        ).value;

        const errorBox = this.#registerView.querySelector(".error");

        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        const regexZip = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        const adresRegex = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;

        if (voornaam === null || voornaam === "") {
            errorBox.innerHTML = "Name can't be empty";
        } else if (achternaam === null || achternaam === "") {
            errorBox.innerHTML = "Surname can't be empty";
        } else if (naamOnderneming === null || naamOnderneming === "") {
            errorBox.innerHTML = "Company name can't be empty";
        } else if (!email.match(regexEmail)) {
            errorBox.innerHTML =
                "Please enter a valid email address, example:  user@gmail.com";
        } else if (!wachtwoord.match(regexPassword)) {
            errorBox.innerHTML = "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
        } else if (!adresRegex.test(adres)) {
            errorBox.innerHTML = "Adress is not entered correctly"
        } else if (!postcode.match(regexZip)) {
            errorBox.innerHTML = "Please enter a zip code";
        } else if (plaats === null || plaats === "") {
            errorBox.innerHTML = "Place can't be empty";
        }  else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else {
            errorBox.innerHTML = "";
            await this.#entrepreneursRepository.createEntrepreneur(
                null,
                naamOnderneming,
                volledigeNaam,
                adres,
                plaats,
                postcode,
                telefoonnummer,
                email,
                wachtwoord
            );
            document.querySelector("#saveAccountBtn").disabled = true;
            setTimeout(function () {
                App.loadController(App.CONTROLLER_LOGIN)
            }, 2000);
        }
    }
}
