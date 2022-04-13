import { Controller } from "./controller.js";
import {App} from "../app.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";

export class TrackOrderController extends Controller {

    #trackView;
    #ordersRepository

    constructor()  {
        super();
        this.#setup();
        this.#ordersRepository = new OrdersRepository();
    }

    async #setup() {
        this.#trackView = await super.loadHtmlIntoContent("html_views/track_order.html");
        document.querySelector(".navbar").style.display = "block";

        this.#fetchOrderByNumAndZip(987728, "2025GH")
    }


    async #fetchOrderByNumAndZip (orderNum, orderZip) {
        try {
            const orderData = await this.#ordersRepository.getOrderByOrderNumAndZip(orderNum, orderZip);
            console.log(orderData)
        } catch (e) {
            console.log(e)
        }
    }
}
