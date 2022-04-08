import {App} from "../app.js";
import {Controller} from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";

export class DashboardController extends Controller {

    #ordersRepository
    #dashboardView;

    constructor()  {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#setup();
    }

    async #setup() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/dashboard.html");
        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link";
        document.querySelector("#nav-dash").className = "nav-link bg-success text-light";
        document.querySelector("#nav-settings").className = "nav-link";
    }
}