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
        App.loadController(App.CONTROLLER_NAVBAR_RIDERS)

        this.#dashboardView = await super.loadHtmlIntoContent("html_views/registerDriver.html");

        document.querySelector(".navbar").style.display = "block";

        this.#dashboardView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#accountGen(event));
    }

    #accountGen(event) {
        event.preventDefault();

        const firstName = this.#dashboardView.querySelector("#inputFirstName").value;
        const surName = this.#dashboardView.querySelector("#inputSurname").value;
        const email = this.#dashboardView.querySelector("#inputEmail").value;
        const wachtwoord = this.#dashboardView.querySelector("#inputPassword").value;
        const adres = this.#dashboardView.querySelector("#inputAdress").value;
        const telefoonnummer = this.#dashboardView.querySelector("#inputPhonenumber").value;
        const plaats = this.#dashboardView.querySelector("#inputResidence").value;
        const postcode = this.#dashboardView.querySelector("#inputPostcode").value;

        const errorBox = this.#dashboardView.querySelector(".error");

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        let regexZip = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;

        if (firstName === null || firstName === "") {
            errorBox.innerHTML = "Name can't be empty";
        } else if (surName === null || surName === "") {
            errorBox.innerHTML = "Surname can't be empty";
        } else if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Please enter a valid email address, example: user@gmail.com";
        } else if (!wachtwoord.match(regexPassword)) {
            errorBox.innerHTML = "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
        } else if (adres === null || adres === "") {
            errorBox.innerHTML = "Please enter an address";
        } else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else if (!postcode.match(regexZip)) {
            errorBox.innerHTML = "Please enter a zip code";
        } else {
            errorBox.innerHTML = "";
            this.#bezorgerRepository.createBezorger(null, firstName, surName,
                adres, plaats, postcode, email, telefoonnummer, wachtwoord);
            App.loadController(App.CONTROLLER_LOGIN_BEZORGER);

        }
    }


}