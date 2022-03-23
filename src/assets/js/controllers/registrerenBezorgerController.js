/**
 * @author Joy Park
 * Controller register/sign up for bezorger
 */

import { Controller } from "./controller.js";
import {BezorgerRepository} from "../repositories/bezorgerRepository.js";

import {App} from "../app.js";


export class RegistrerenBezorgerController extends Controller {

    #dashboardView;
    #bezorgerRepository;



    constructor()  {
        super();

        this.#bezorgerRepository = new BezorgerRepository();
        this.#setup();
    }

    async #setup() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/registrerenBezorger.html");

        this.#dashboardView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#accountGen(event));

    }

    #accountGen(event) {
        event.preventDefault();

        const firstName = this.#dashboardView.querySelector("#inputFirstName").value;
        const surName = this.#dashboardView.querySelector("#inputSurname").value;
        const email = this.#dashboardView.querySelector("#inputEmail").value;
        const wachtwoord = this.#dashboardView.querySelector("#inputPassword").value;
        const telefoonnummer = this.#dashboardView.querySelector("#inputPhonenumber").value;
        const adres = this.#dashboardView.querySelector("#inputAdress").value;
        const plaats = this.#dashboardView.querySelector("#inputResidence").value;
        const postcode = this.#dashboardView.querySelector("#inputPostcode").value;
        const datum = 5;




        const errorBox = this.#dashboardView.querySelector(".error");

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Please enter a valid email address, example: user@gmail.com";
        } else if (firstName === null || firstName === "") {
            errorBox.innerHTML = "name can't be empty";
        } else if (surName === null || surName === "") {
            errorBox.innerHTML = "surname can't be empty";
        } else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else {

            errorBox.innerHTML = "";
            this.#bezorgerRepository.createBezorger(null, firstName, surName, datum,
                adres, plaats, postcode, email, telefoonnummer, wachtwoord);
            App.loadController(App.CONTROLLER_LOGIN_BEZORGER);

        }
    }


}