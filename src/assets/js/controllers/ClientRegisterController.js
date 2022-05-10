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

        document.querySelector(".navbar").style.display = "block";
    }
}