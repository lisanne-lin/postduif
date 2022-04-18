import {Controller} from "./controller.js";
import {App} from "../app.js";
import {CustomersRepository} from "../repositories/customersRepository.js";

export class ClientRegisterController extends Controller {
    #clientRegisterView;
    #customersRepository;

    constructor() {
        super();
        this.#customersRepository = new CustomersRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#clientRegisterView = await super.loadHtmlIntoContent("html_views/client_register.html")

        document.querySelector(".navbar").style.display = "block";
    }
}