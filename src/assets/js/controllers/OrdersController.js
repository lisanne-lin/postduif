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
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);

        this.#orderView = await super.loadHtmlIntoContent("html_views/orders.html")
        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link active";
        document.querySelector("#nav-dash").className = "nav-link";
        document.querySelector("#nav-settings").className = "nav-link";

        this.#orderView.querySelector("#place-order-btn").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })

        this.#orderView.querySelector("#search-order-btn").addEventListener("click", event => {
            this.#fetchOrderByNum(this.#orderView.querySelector("#search-order-input").value)

        })

        this.#orderView.querySelector("#delete-btn").addEventListener("click", event => {
            this.#deleteOrder(this.#orderView.querySelector("#order-num").value)
        })


            //from here we can safely get elements from the view via the right getter
        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchOrders();
        this.#fetchOrderCount();
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @private
     */
    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrders();

        for (let i = 0; i < 60; i++) {
            let data = orderData[i];
            const table = this.#orderView.querySelector("#order-table");
            let tableRow = table.insertRow()
            let orderCell = tableRow.insertCell()
            let nameCell = tableRow.insertCell()
            let adresCell = tableRow.insertCell()
            let residenceCell = tableRow.insertCell()
            let zipCell = tableRow.insertCell()
            let statusCell = tableRow.insertCell()
            let infoCell = tableRow.insertCell()

            orderCell.append(data.bestelnummer);
            nameCell.append(data.verzendnaam);
            adresCell.append(data.verzendadres);
            residenceCell.append(data.verzendplaats);
            zipCell.append(data.verzend_postcode);
            statusCell.append(data.status);

            let btn = document.createElement('a');
            btn.type = "button";
            btn.className = "btn btn-outline-succes"
            btn.innerHTML = "Info";

            infoCell.append(btn);

            table.append(tableRow);
        }
    }

    async #fetchOrderByNum(orderNum) {
        try {
            const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNum);
            if (orderData != null) {

                let orderName = this.#orderView.querySelector("#order-name");
                let orderStreet = this.#orderView.querySelector("#order-street");
                let orderZip = this.#orderView.querySelector("#order-zip");
                let orderResidence = this.#orderView.querySelector("#order-residence");
                // let orderEmail = this.#orderView.querySelector("#order-email");
                let orderRemark = this.#orderView.querySelector("#order-remark");
                let orderStatus = this.#orderView.querySelector("#order-status");
                let orderEstimate = this.#orderView.querySelector("#order-estimate");
                let orderShipped = this.#orderView.querySelector("#order-ship");
                let orderCharge = this.#orderView.querySelector("#order-charge");
                let orderId = this.#orderView.querySelector("#order-num");

                const now = new Date();
                let geschatte_bezorgdatum = orderData[0].geschatte_bezorgdatum
                geschatte_bezorgdatum = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);

                let verzend_datum = orderData[0].verzend_datum
                verzend_datum = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);

                orderId.value = orderData[0].bestelnummer
                orderName.value = orderData[0].verzendnaam
                orderStreet.value = orderData[0].verzendadres
                orderZip.value = orderData[0].verzend_postcode
                orderResidence.value = orderData[0].verzendplaats

                orderRemark.value = orderData[0].opmerking
                orderStatus.value = orderData[0].status

                orderEstimate.value = geschatte_bezorgdatum
                orderShipped.value = verzend_datum
                orderCharge.value = orderData[0].bezorgkosten

                this.#orderView.querySelector("#order-overview").style = "block";
                this.#orderView.querySelector("#order-error").style.display= "none";
            }
        } catch (e) {
            this.#orderView.querySelector("#order-error").style = "block"
            this.#orderView.querySelector("#order-overview").style.display = "none";
        }

    }

    async #fetchOrderCount() {
        const amount = await this.#ordersRepository.countOrders(1);

        this.#orderView.querySelector("#order-count").innerHTML = amount.aantal
    }

    async #deleteOrder(orderNumber) {
        let num = parseInt(orderNumber)
        console.log(num)
        await this.#ordersRepository.deleteOrders(num);
        App.loadController(App.CONTROLLER_ORDERS);
    }

    // async #fetchUpdateOrder() {
    //     this.#orderView.querySelector("#order-count") =
    // }
}
