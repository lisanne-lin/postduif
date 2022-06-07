/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 * uhuh
 * @author Lennard Fonteijn & Pim Meijer
 */

import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class OrdersController extends Controller {
    #ordersRepository
    #entrepreneursRepository
    #orderView
    #ID;

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
        const ENTREPRENEUR_ID = await this.#entrepreneursRepository.getUserIdByEmail(App.sessionManager.get("username"))
        this.#ID = ENTREPRENEUR_ID[0].ondernemer_id;

        this.#orderView = await super.loadHtmlIntoContent("html_views/orders.html")
        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link active";
        document.querySelector("#nav-dash").className = "nav-link";
        document.querySelector("#nav-settings").className = "nav-link";

        this.#orderView.querySelector("#place-order-btn").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })

        this.#orderView.querySelector("#search-order-btn").addEventListener("click", event => {
            this.#fetchOrdersByInfo(this.#orderView.querySelector("#search-order-input").value)

        })

        this.#orderView.querySelector("#delete-btn").addEventListener("click", event => {
            this.#deleteOrder(this.#orderView.querySelector("#order-num").value)
        })

        this.#fetchOrders();
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @private
     */
    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrders();

        for (let i = 0; i < 60; i++) {
            let data = orderData[i];
            const table = this.#orderView.querySelector("#orders-tbody");
            let tableRow = table.insertRow()
            let orderCell = tableRow.insertCell()
            let nameCell = tableRow.insertCell()
            let adresCell = tableRow.insertCell()
            let residenceCell = tableRow.insertCell()
            let zipCell = tableRow.insertCell()
            let statusCell = tableRow.insertCell()

            orderCell.append(data.bestelnummer);
            nameCell.append(data.verzendnaam);
            adresCell.append(data.verzendadres);
            residenceCell.append(data.verzendplaats);
            zipCell.append(data.verzend_postcode);
            statusCell.append(data.status);

            tableRow.dataset.target = "#exampleModal";
            tableRow.dataset.toggle = "modal";

            tableRow.addEventListener("click", async event => {
                await this.#fetchOrderDetails(data.bestelnummer);
            })
        }
    }

    async #fetchOrderDetails(orderNumber) {
        const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNumber);

        let orderStatus = this.#orderView.querySelector("#status");
        let orderEstimate = this.#orderView.querySelector("#estimated");
        let orderName = this.#orderView.querySelector("#name");
        let orderStreet = this.#orderView.querySelector("#adress");
        let orderZip = this.#orderView.querySelector("#zip");
        let orderEntrepreneurName = this.#orderView.querySelector("#entrepreneur-name");
        let orderEntrepreneurAdress = this.#orderView.querySelector("#entrepreneur-adress");
        let orderEntrepreneurZip = this.#orderView.querySelector("#entrepreneur-zip");
        let orderRemark = this.#orderView.querySelector("#entrepreneur-remark");
        let orderNum = this.#orderView.querySelector("#order-number");

        let geschatte_bezorgdatum = orderData.geschatte_bezorgdatum

        orderNum.innerHTML = orderData[0].bestelnummer
        orderName.innerHTML = orderData[0].verzendnaam
        orderStreet.innerHTML = orderData[0].verzendadres
        orderZip.innerHTML = orderData[0].verzend_postcode
        orderRemark.innerHTML = orderData[0].opmerking
        orderStatus.innerHTML = orderData[0].status
        orderEstimate.innerHTML = geschatte_bezorgdatum
        orderEntrepreneurName.innerHTML = orderData[0].naam
        orderEntrepreneurAdress.innerHTML = orderData[0].adres
        orderEntrepreneurZip.innerHTML = orderData[0].postcode

        this.#orderView.querySelector("#edit-btn").addEventListener("click", async event => {
            await this.#editOrder(orderData[0].bestelnummer);
        })

        this.#orderView.querySelector("#close-btn").addEventListener("click", event => {this.#deleteOrder()})
    }

    async #deleteOrder() {

    }

    async #fetchOrdersByInfo(info) {
        const orderData = await this.#ordersRepository.getOrderByInfo(info);
        this.#orderView.querySelector("#orders-tbody").remove();

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

            orderCell.append(data.bestelnummer);
            nameCell.append(data.verzendnaam);
            adresCell.append(data.verzendadres);
            residenceCell.append(data.verzendplaats);
            zipCell.append(data.verzend_postcode);
            statusCell.append(data.status);

            tableRow.dataset.target = "#exampleModal";
            tableRow.dataset.toggle = "modal";
            table.className = "table table-hover"

            tableRow.addEventListener("click", async event => {
                await this.#fetchOrderDetails(data.bestelnummer);
            })
        }
    }

    async #editOrder(orderNumber) {
        const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNumber)

        this.#orderView.querySelector("#exampleInputName").value = orderData[0].verzendnaam
        this.#orderView.querySelector("#exampleInputAdres").value = orderData[0].verzendadres
        this.#orderView.querySelector("#exampleInputPlaats").value = orderData[0].verzendplaats
        this.#orderView.querySelector("#exampleInputPostcode").value = orderData[0].verzend_postcode
        this.#orderView.querySelector("#exampleInputBezorgdatum").value = orderData[0].geschatte_bezorgdatum
        this.#orderView.querySelector("#exampleInputVerzenddatum").value = orderData[0].verzend_datum
        this.#orderView.querySelector("#exampleInputStatus").value = orderData[0].prijs
        this.#orderView.querySelector("#exampleInputBezorgkosten").value = orderData[0].bezorgkosten

        this.#orderView.querySelector("#save-btn2").addEventListener("click", event => {this.#saveOrder()})
    }

    async #fetchOrderByNum(orderNum) {
        try {
            const orderData = await this.#ordersRepository.getOrderByOrderNum(orderNum);
            if (orderData != null) {

                let orderName = this.#orderView.querySelector("#order-name");
                let orderStreet = this.#orderView.querySelector("#order-street");
                let orderZip = this.#orderView.querySelector("#order-zip");
                let orderResidence = this.#orderView.querySelector("#order-residence");
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
                this.#orderView.querySelector("#order-error").style.display = "none";
            }
        } catch (e) {
            this.#orderView.querySelector("#order-error").style = "block"
            this.#orderView.querySelector("#order-overview").style.display = "none";
        }
    }
}
