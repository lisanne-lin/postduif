import {Controller} from "./controller.js";
import {CustomersRepository} from "../repositories/customersRepository.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";

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

    async #saveAccount(event) {
        event.preventDefault();

        const voornaam = this.#clientRegisterView.querySelector(
            "#exampleInputNaamEigenaar"
        ).value;
        const achternaam = this.#clientRegisterView.querySelector(
            "#exampleInputAchternaam"
        ).value;
        const email =
            this.#clientRegisterView.querySelector("#exampleInputEmail").value;
        const wachtwoord = this.#clientRegisterView.querySelector(
            "#exampleInputPassword"
        ).value;
        const telefoonnummer = this.#clientRegisterView.querySelector(
            "#exampleInputPhonenumber"
        ).value;
        const adres = this.#clientRegisterView.querySelector(
            "#exampleInputAdress"
        ).value;
        const plaats = this.#clientRegisterView.querySelector(
            "#exampleInputResidence"
        ).value;
        const postcode = this.#clientRegisterView.querySelector(
            "#exampleInputPostcode"
        ).value;

        const errorBox = this.#clientRegisterView.querySelector(".error");

        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        const regexZip = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        const adresRegex = /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i;

        if (voornaam === null || voornaam === "") {
            errorBox.innerHTML = "Name can't be empty";
        } else if (voornaam === null || voornaam === "") {
            errorBox.innerHTML = "Name can't be empty";
        } else if (achternaam === null || achternaam === "") {
            errorBox.innerHTML = "Surname can't be empty";
        } else if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Please enter a valid email address, example:  user@gmail.com";
        } else if (!wachtwoord.match(regexPassword)) {
            errorBox.innerHTML = "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
        } else if (!adres.match(adresRegex)) {
            errorBox.innerHTML = "Please enter a correct address";
        } else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else if (plaats === null || plaats === "") {
            errorBox.innerHTML = "Place can't be empty";
        }  else if (!postcode.match(regexZip)) {
            errorBox.innerHTML = "Please enter a zip code";
        } else {
            errorBox.innerHTML = "";
            await this.#customersRepository.createCustomer(
                null,
                voornaam,
                achternaam,
                email,
                telefoonnummer,
                plaats,
                adres,
                postcode,
                wachtwoord
            );
        }
    }
}
