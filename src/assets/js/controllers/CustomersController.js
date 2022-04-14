import {App} from "../app.js";
import {Controller} from "./controller.js";
import {CustomersRepository} from "../repositories/customersRepository.js";

export class CustomersController extends Controller {

    #customersRepository
    #customersView;

    constructor() {
        super();
        this.#customersRepository = new CustomersRepository();
        this.#setup();
    }

    async #setup() {
        this.#customersView = await super.loadHtmlIntoContent("html_views/customers.html");
    }

}