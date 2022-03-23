/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 * uhuh
 * @author Lennard Fonteijn & Pim Meijer
 */

import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class OrdersController extends Controller {
    #ordersRepository
    #orderView

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#orderView = await super.loadHtmlIntoContent("html_views/orders.html")
        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link bg-success text-light";
        document.querySelector("#nav-dash").className = "nav-link";
        document.querySelector("#nav-settings").className = "nav-link";

        this.#orderView.querySelector("#place-order-btn").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })

        this.#orderView.querySelector("#search-order-btn").addEventListener("click", event => {
            this.#fetchOrderByNum(this.#orderView.querySelector("#search-order-input").value)
        })

        //from here we can safely get elements from the view via the right getter
        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchOrders();
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @private
     */
    async #fetchOrders() {
        const exampleResponse = this.#orderView.querySelector(".order")

        const orderData = await this.#ordersRepository.getOrders();

        for (let i = 0; i < orderData.length; i++) {
            let data = orderData[i];
            const table = this.#orderView.querySelector("#order-table");
            let tableRow = table.insertRow()
            let orderCell = tableRow.insertCell()
            let nameCell = tableRow.insertCell()
            let adresCell = tableRow.insertCell()
            let residenceCell = tableRow.insertCell()
            let zipCell = tableRow.insertCell()
            let orderDateCell = tableRow.insertCell()
            let statusCell = tableRow.insertCell()

            orderCell.append(data.bestelnummer);
            nameCell.append(data.verzendnaam);
            adresCell.append(data.verzendadres);
            residenceCell.append(data.verzendplaats);
            zipCell.append(data.verzend_postcode);
            orderDateCell.append(data.geschatte_bezorgdatum);
            statusCell.append(data.status);

            table.append(tableRow)
        }
    }

    async #fetchOrderByNum (orderNum) {
        try {
            let response = this.#orderView.querySelector("#order-info")

            const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNum);

            response.innerHTML = (JSON.stringify(orderData, null, 4));
        } catch (e) {
            response.innerHTML = e;
        }
    }
}