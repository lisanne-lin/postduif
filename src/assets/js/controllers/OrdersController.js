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
            const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNum);

            let orderName = this.#orderView.querySelector("#order-name");
            let orderStreet = this.#orderView.querySelector("#order-street");
            let orderZip = this.#orderView.querySelector("#order-zip");
            let orderResidence = this.#orderView.querySelector("#order-residence");
            // let orderEmail = this.#orderView.querySelector("#order-email");
            let orderRemark = this.#orderView.querySelector("#order-remark");
            let orderStatus = this.#orderView.querySelector("#order-status");
            let orderEstimate = this.#orderView.querySelector("#order-estimate");
            let orderCharge = this.#orderView.querySelector("#order-charge");

            orderName.innerHTML = orderData[0].verzendnaam
            orderStreet.innerHTML = orderData[0].verzendadres
            orderZip.innerHTML = orderData[0].verzend_postcode
            orderResidence.innerHTML = orderData[0].verzendplaats
            // orderEmail.innerHTML = orderData[0].verzendnaam
            orderRemark.innerHTML = orderData[0].opmerking
            orderStatus.innerHTML = orderData[0].status
            orderEstimate.innerHTML = orderData[0].geschatte_bezorgdatum
            orderCharge.innerHTML = orderData[0].bezorgkosten
        } catch (e) {
            response.innerHTML = e;
        }
    }
}