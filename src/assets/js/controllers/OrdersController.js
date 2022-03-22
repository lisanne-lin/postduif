/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 * uhuh
 * @author Lennard Fonteijn & Pim Meijer
 */

import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class OrdersController extends Controller{
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
        document.querySelector("#nav-orders").className = "nav-link active";
        //from here we can safely get elements from the view via the right getter
        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchOrders();
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param bestelnummer the room id to retrieve
     * @private
     */
    async #fetchOrders() {
        const exampleResponse = this.#orderView.querySelector(".order")

        // try {
            //await keyword 'stops' code until data is returned - can only be used in async function
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

                console.log(data)
                orderCell.append(data.bestelnummer);
                nameCell.append(data.verzendnaam);
                table.append(tableRow)
            }

            // exampleResponse.innerHTML = JSON.stringify(orderData);

        // } catch (e) {
        //     console.log("error while fetching rooms", e);
        //
        //     //for now just show every error on page, normally not all errors are appropriate for user
        //     exampleResponse.innerHTML = e;
        // }
    }
}