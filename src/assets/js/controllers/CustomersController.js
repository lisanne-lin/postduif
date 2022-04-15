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

        this.#fetchCustomers()
        this.#fetchCustomerByName()
    }

    async #fetchCustomers() {
        const data = await this.#customersRepository.getCustomers(1);

        // for (let i = 0; i < 60; i++) {
        //     let data = orderData[i];
        //     // const table = this.#orderView.querySelector("#order-table");
        //     let tableRow = table.insertRow()
        //     let imageCell = tableRow.insertCell()
        //     let nameCell = tableRow.insertCell()
        //     let emailCell = tableRow.insertCell()
        //     let numberCull = tableRow.insertCell()
        //     let locationCell = tableRow.insertCell()
        //     let contactCell = tableRow.insertCell()
        //
        //     orderCell.append(data.bestelnummer);
        //     imageCell.append(this.#customersView.querySelector())
        //     nameCell.append(data.verzendnaam);
        //     emailCell.append(data.verzendadres);
        //     numberCull.append(data.verzendplaats);
        //     locationCell.append(data.verzend_postcode);
        //     contactCell.append(data.geschatte_bezorgdatum);
        //
        //     table.append(tableRow);
        // }
    }

    async #fetchCustomerByName() {
        const data = await this.#customersRepository.getCustomerByNum("Simon");

    }

}