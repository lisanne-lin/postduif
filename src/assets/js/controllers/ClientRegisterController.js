import {Controller} from "./controller.js";
import {CustomersRepository} from "../repositories/customersRepository.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";

/**
 * Controller for the ClientRegisterPage
 * @author Simon Vriesema
 */

export class ClientRegisterController extends Controller {
    #clientRegisterView;
    #customersRepository;
    #ordersRepository;

    constructor() {
        super();
        this.#customersRepository = new CustomersRepository();
        this.#ordersRepository = new OrdersRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div and runs the functions
     * @returns {Promise<void>}
     */
    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_CLIENT);

        this.#clientRegisterView = await super.loadHtmlIntoContent(
            "html_views/register_client.html"
        );

        this.#clientRegisterView
            .querySelector("#saveAccountBtn")
            .addEventListener("click", (event) => this.#saveAccount(event));

        document.querySelector("#nav-settings").style.display = "none";
        document.querySelector("#nav-track").style.display = "none";
        document.querySelector("#nav-logout").style.display = "none";
    }

    /**
     * Function to save account to DB
     * @param event = event
     * @returns {Promise<void>}
     */
    async #saveAccount(event) {
        event.preventDefault();

        const FIRST_NAME = this.#clientRegisterView.querySelector(
            "#exampleInputNaamEigenaar"
        ).value;
        const LAST_NAME = this.#clientRegisterView.querySelector(
            "#exampleInputAchternaam"
        ).value;
        const EMAIL = this.#clientRegisterView.querySelector("#exampleInputEmail").value;
        const PASSWORD = this.#clientRegisterView.querySelector(
            "#exampleInputPassword"
        ).value;
        const PHONENUMBER = this.#clientRegisterView.querySelector(
            "#exampleInputPhonenumber"
        ).value;
        const ADDRESS = this.#clientRegisterView.querySelector(
            "#exampleInputAdress"
        ).value;
        const PLACE = this.#clientRegisterView.querySelector(
            "#exampleInputResidence"
        ).value;
        const ZIP = this.#clientRegisterView.querySelector(
            "#exampleInputPostcode"
        ).value;

        const ERROR_BOX = this.#clientRegisterView.querySelector(".error");

        const REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        const REGEX_ZIP = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        const REGEX_ADDRESS = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;

        if (FIRST_NAME === null || FIRST_NAME === "") {
            ERROR_BOX.innerHTML = "Name can't be empty";
        } else if (FIRST_NAME === null || FIRST_NAME === "") {
            ERROR_BOX.innerHTML = "Name can't be empty";
        } else if (LAST_NAME === null || LAST_NAME === "") {
            ERROR_BOX.innerHTML = "Surname can't be empty";
        } else if (!EMAIL.match(REGEX_EMAIL)) {
            ERROR_BOX.innerHTML = "Please enter a valid email address, example:  user@gmail.com";
        } else if (!PASSWORD.match(REGEX_PASSWORD)) {
            ERROR_BOX.innerHTML = "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
        } else if (!ADDRESS.match(REGEX_ADDRESS)) {
            ERROR_BOX.innerHTML = "Please enter a correct address";
        } else if (PHONENUMBER === null || PHONENUMBER === "") {
            ERROR_BOX.innerHTML = "Phone number can't be empty";
        } else if (PLACE === null || PLACE === "") {
            ERROR_BOX.innerHTML = "Place can't be empty";
        } else if (!ZIP.match(REGEX_ZIP)) {
            ERROR_BOX.innerHTML = "Please enter a zip code";
        } else {
            ERROR_BOX.innerHTML = "";
            await this.#customersRepository.createCustomer(
                null,
                FIRST_NAME,
                LAST_NAME,
                EMAIL,
                PHONENUMBER,
                PLACE,
                ADDRESS,
                ZIP,
                PASSWORD
            );
        }
    }
}
