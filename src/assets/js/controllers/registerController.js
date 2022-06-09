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

        const NAME = this.#registerView.querySelector(
            "#exampleInputNaamOnderneming"
        ).value;
        const FIRST_NAME = this.#registerView.querySelector(
            "#exampleInputNaamEigenaar"
        ).value;
        const LAST_NAME = this.#registerView.querySelector(
            "#exampleInputAchternaam"
        ).value;
        const FULL_NAME = FIRST_NAME + " " + LAST_NAME;
        const EMAIL_ADDRESS =
            this.#registerView.querySelector("#exampleInputEmail").value;
        const PASSWORD = this.#registerView.querySelector(
            "#exampleInputPassword"
        ).value;
        const PHONENUMBER = this.#registerView.querySelector(
            "#exampleInputPhonenumber"
        ).value;
        const ADDRESS = this.#registerView.querySelector(
            "#exampleInputAdress"
        ).value;
        const PLACE = this.#registerView.querySelector(
            "#exampleInputResidence"
        ).value;
        const ZIP = this.#registerView.querySelector(
            "#exampleInputPostcode"
        ).value;

        const errorBox = this.#registerView.querySelector(".error");

        const EMAIL_ADDRESS_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        const ZIP_REGEX = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        const ADRESS_REGEX = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;

        if (FIRST_NAME === null || FIRST_NAME === "") {
            errorBox.innerHTML = "Name can't be empty";
        } else if (LAST_NAME === null || LAST_NAME === "") {
            errorBox.innerHTML = "Surname can't be empty";
        } else if (NAME === null || NAME === "") {
            errorBox.innerHTML = "Company name can't be empty";
        } else if (!EMAIL_ADDRESS.match(EMAIL_ADDRESS_REGEX)) {
            errorBox.innerHTML =
                "Please enter a valid EMAIL_ADDRESS address, example:  user@gmail.com";
        } else if (!PASSWORD.match(PASSWORD_REGEX)) {
            errorBox.innerHTML = "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
        } else if (!ADRESS_REGEX.test(ADDRESS)) {
            errorBox.innerHTML = "ADDRESSs is not entered correctly"
        } else if (!ZIP.match(ZIP_REGEX)) {
            errorBox.innerHTML = "Please enter a zip code";
        } else if (PLACE === null || PLACE === "") {
            errorBox.innerHTML = "Place can't be empty";
        }  else if (PHONENUMBER === null || PHONENUMBER === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else {
            errorBox.innerHTML = "";
            await this.#entrepreneursRepository.createEntrepreneur(
                null,
                NAME,
                FULL_NAME,
                ADDRESS,
                PLACE,
                ZIP,
                PHONENUMBER,
                EMAIL_ADDRESS,
                PASSWORD
            );
            document.querySelector("#saveAccountBtn").disabled = true;
            setTimeout(function () {
                App.loadController(App.CONTROLLER_LOGIN)
            }, 2000);
        }
    }
}
