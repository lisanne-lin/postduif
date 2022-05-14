import {App} from "../app.js";
import {Controller} from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class DashboardController extends Controller {

    #ordersRepository
    #entrepreneursRepository
    #dashboardView;

    constructor()  {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setup();
    }

    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);

        this.#dashboardView = await super.loadHtmlIntoContent("html_views/dashboard.html");
        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link";
        document.querySelector("#nav-settings").className = "nav-link";
        document.querySelector("#nav-dash").className = "nav-link active";

        this.#fetchOrders();
        this.#fetchOrderCountOmw();
        this.#fetchOrderCountHere();
        this.#fetchEarningsToday()
        this.#fetchEarningsWeek()
        this.#fetchEarningsMonth();
        this.#fetchCollectedMoney();
        this.#fetchEntrepreneurData();
        this.#fetchPercentages();
    }

    async #fetchPercentages() {
        const orderDataToday = await this.#ordersRepository.calculateEarningsToday(1);
        const orderDataYesterday = await this.#ordersRepository.calculateEarningsYesterday(1);
        const orderDataWeek = await this.#ordersRepository.calculateEarningsWeek(1);
        const orderDataLastWeek = await this.#ordersRepository.calculateEarningsLastWeek(1);
        const orderDataMonth = await this.#ordersRepository.calculateEarningsMonth(1);
        const orderDataLastMonth = await this.#ordersRepository.calculateEarningsLastMonth(1);

        const percentageToday = (((orderDataYesterday.prijs - orderDataToday.prijs) / orderDataToday.prijs) * 100);
        const percentageWeek = (((orderDataWeek.prijs - orderDataLastWeek.prijs) / orderDataLastWeek.prijs) * 100 );
        const percentageMonth = (((orderDataMonth.prijs - orderDataLastMonth.prijs) / orderDataLastMonth.prijs) * 100 );

        this.#dashboardView.querySelector("#percentageday").innerHTML = percentageToday;
        this.#dashboardView.querySelector("#percentageweek").innerHTML = percentageWeek;
        this.#dashboardView.querySelector("#percentagemonth").innerHTML = percentageMonth;


    }

    async #fetchEntrepreneurData() {
        const data = await this.#entrepreneursRepository.getEntrepreneurById(1);
        this.#dashboardView.querySelector("#businessOwner").innerHTML = data[0].eigenaar;
        this.#dashboardView.querySelector("#businessName").innerHTML = data[0].naam;
    }

    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrders();

        for (let i = 0; i < 6; i++) {
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
        if (amount.prijs == null) {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = amount.prijs
        }
    }

    async #fetchEarningsWeek() {
        const amount = await this.#ordersRepository.calculateEarningsWeek(1);
        if (amount.prijs == null) {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = amount.prijs
        }
    }

    async #fetchEarningsMonth() {
        const amount = await this.#ordersRepository.calculateEarningsMonth(1);
        if (amount.prijs == null) {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = amount.prijs
        }
    }

    async #fetchCollectedMoney() {
        const data = await this.#ordersRepository.calculateDonatedMoney(1);

        const amount = (Math.round(data.donatie* 100) / 100).toFixed(2);
        this.#dashboardView.querySelector("#collected-money").innerHTML = amount
    }
}

