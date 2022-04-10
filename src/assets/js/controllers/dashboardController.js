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
        document.querySelector("#nav-settings").className = "nav-link";
        document.querySelector("#nav-dash").className = "nav-link active";

        this.#fetchOrders();
        this.#fetchOrderCountOmw();
        this.#fetchOrderCountHere();
        this.#fetchEarningsToday()
    }

    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrders();

        for (let i = 0; i < 8; i++) {
            let data = orderData[i];
            const table = this.#dashboardView.querySelector("#order-table");
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

            table.append(tableRow);
        }
    }

    async #fetchOrderCountOmw() {
        const amount = await this.#ordersRepository.countOrdersOmw(1);

        this.#dashboardView.querySelector("#orders-omw").innerHTML = amount.aantal
    }

    async #fetchOrderCountHere() {
        const amount = await this.#ordersRepository.countOrdersHere(1);

        this.#dashboardView.querySelector("#orders-delivered").innerHTML = amount.aantal
    }

    async #fetchEarningsToday() {
        const amount = await this.#ordersRepository.calculateEarningsToday(1);

        this.#dashboardView.querySelector("#earnings-today").innerHTML = amount.prijs
    }
}

