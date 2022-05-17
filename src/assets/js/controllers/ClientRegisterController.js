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

        this.#clientRegisterView = await super.loadHtmlIntoContent("html_views/register_client.html")

        this.#clientRegisterView.querySelector("#saveAccountBtn").addEventListener("click",
            (event) => this.#saveAccount(event));

        document.querySelector("#nav-settings").style.display = "none";
        document.querySelector("#nav-track").style.display = "none";
        document.querySelector("#nav-logout").style.display = "none";

    }

    async #saveAccount(event) {
        event.preventDefault();

        const voornaam = this.#clientRegisterView.querySelector("#exampleInputNaamEigenaar").value;
        const achternaam = this.#clientRegisterView.querySelector("#exampleInputAchternaam").value;
        const email = this.#clientRegisterView.querySelector("#exampleInputEmail").value;
        const wachtwoord = this.#clientRegisterView.querySelector("#exampleInputPassword").value;
        const telefoonnummer = this.#clientRegisterView.querySelector("#exampleInputPhonenumber").value;
        const adres = this.#clientRegisterView.querySelector("#exampleInputAdress").value;
        const plaats = this.#clientRegisterView.querySelector("#exampleInputResidence").value;
        const postcode = this.#clientRegisterView.querySelector("#exampleInputPostcode").value;

        const errorBox = this.#clientRegisterView.querySelector(".error");

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email.match(regexEmail)) {
            errorBox.innerHTML = "Please enter a valid email address, example: john-doe@hotmale.com";
        } else if (telefoonnummer === null || telefoonnummer === "") {
            errorBox.innerHTML = "Phone number can't be empty";
        } else {
            errorBox.innerHTML = "";
            await this.#customersRepository.createCustomer(null, voornaam, achternaam, email, telefoonnummer,
                plaats, adres, postcode, wachtwoord);
        }
    }
}