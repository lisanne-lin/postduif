import {App} from "../app.js";
import {Controller} from "./controller.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class DashboardController extends Controller {

    #ordersRepository
    #entrepreneursRepository
    #dashboardView;
    #ID;

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setup();
    }

    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
        const ENTREPRENEUR_ID = await this.#entrepreneursRepository.getUserIdByEmail(App.sessionManager.get("username"))
        this.#ID = ENTREPRENEUR_ID[0].entrepreneur_id;

        console.log(this.#ID)
        console.log(App.sessionManager.get("username"))

        this.#dashboardView = await super.loadHtmlIntoContent("html_views/dashboard.html");

        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-orders").className = "nav-link";
         document.querySelector("#nav-dash").className = "nav-link active";

        this.#dashboardView.querySelector("#place-order-btn").addEventListener("click", event => {
            App.loadController(App.CONTROLLER_ORDERS);
        })

        this.#fetchOrders();
        this.#fetchOrderCountOmw();
        this.#fetchOrderCountHere();
        this.#fetchEarningsToday()
        this.#fetchEarningsWeek()
        this.#fetchEarningsMonth();
        this.#fetchCollectedMoney();
        this.#fetchEntrepreneurData();
        this.#fetchPercentages();
        this.#fetchChartData();
    }

    async #fetchPercentages() {
        const orderDataToday = await this.#ordersRepository.calculateEarningsToday(this.#ID);
        const orderDataYesterday = await this.#ordersRepository.calculateEarningsYesterday(this.#ID);
        const orderDataWeek = await this.#ordersRepository.calculateEarningsWeek(this.#ID);
        const orderDataLastWeek = await this.#ordersRepository.calculateEarningsLastWeek(this.#ID);
        const orderDataMonth = await this.#ordersRepository.calculateEarningsMonth(this.#ID);
        const orderDataLastMonth = await this.#ordersRepository.calculateEarningsLastMonth(this.#ID);

        const percentageToday = (((orderDataYesterday.price - orderDataToday.price) / orderDataToday.price) * 100);
        const percentageWeek = (((orderDataLastWeek.price - orderDataWeek.price) / orderDataWeek.price) * 100);
        const percentageMonth = (((orderDataLastMonth.price - orderDataMonth.price) / orderDataMonth.price) * 100);

        this.#dashboardView.querySelector("#percentageday").innerHTML = percentageToday;
        this.#dashboardView.querySelector("#percentageweek").innerHTML = percentageWeek;
        this.#dashboardView.querySelector("#percentagemonth").innerHTML = percentageMonth;
    }

    async #fetchEntrepreneurData() {
        const data = await this.#entrepreneursRepository.getEntrepreneurById(this.#ID);
        this.#dashboardView.querySelector("#businessOwner").innerHTML = data[0].eigenaar;
        this.#dashboardView.querySelector("#businessName").innerHTML = data[0].naam;
    }

    async #fetchChartData() {
        const DATA_TODAY = await this.#ordersRepository.getTodaysOrder(this.#ID);
        const DATA_YESTERDAY = await this.#ordersRepository.getYesterdaysOrder(this.#ID);
        const DATA_TWO_DAYS = await this.#ordersRepository.getOrderDataTwoDaysAgo(this.#ID);
        const DATA_THREE_DAYS = await this.#ordersRepository.getOrderDataThreeDaysAgo(this.#ID);
        const DATA_FOUR_DAYS = await this.#ordersRepository.getOrderDataFourDaysAgo(this.#ID);
        const DATA_FIVE_DAYS = await this.#ordersRepository.getOrderDataFiveDaysAgo(this.#ID);
        const DATA_SEVEN_DAYS = await this.#ordersRepository.getOrderDataSevenDaysAgo(this.#ID);
        const DATA_TWO_WEEKS = await this.#ordersRepository.getOrderDataTwoWeeksAgo(this.#ID);
        const DATA_THREE_WEEKS = await this.#ordersRepository.getOrderDataThreeWeeksAgo(this.#ID);
        const DATA_FOUR_WEEKS = await this.#ordersRepository.getOrderDataFourWeeksAgo(this.#ID);

        const ORDERS_FIVE_DAYS = {
            // A labels array that can contain any sort of values
            labels: ['5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', "Today"],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [DATA_FIVE_DAYS[0].Orders, DATA_FOUR_DAYS[0].Orders, DATA_THREE_DAYS[0].Orders, DATA_TWO_DAYS[0].Orders, DATA_YESTERDAY[0].Orders, DATA_TODAY[0].Orders]
            ]
        };

        const ORDERS_FOUR_WEEKS = {
            // A labels array that can contain any sort of values
            labels: ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', '7 days ago', "Today"],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [DATA_FOUR_WEEKS[0].Orders, DATA_THREE_WEEKS[0].Orders, DATA_TWO_WEEKS[0].Orders, DATA_SEVEN_DAYS[0].Orders, DATA_TODAY[0].Orders]
            ]
        };

        const EARNINGS_FIVE_DAYS = {
            // A labels array that can contain any sort of values
            labels: ['5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', "Today"],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [DATA_FIVE_DAYS[0].Earnings, DATA_FOUR_DAYS[0].Earnings, DATA_THREE_DAYS[0].Earnings, DATA_TWO_DAYS[0].Earnings, DATA_YESTERDAY[0].Earnings, DATA_TODAY[0].Earnings]
            ]
        };

        let EARNINGS_FOUR_WEEKS = {
            // A labels array that can contain any sort of values
            labels: ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', '7 days ago', "Today"],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [DATA_FOUR_WEEKS[0].Earnings, DATA_THREE_WEEKS[0].Earnings, DATA_TWO_WEEKS[0].Earnings, DATA_SEVEN_DAYS[0].Earnings, DATA_TODAY[0].Earnings]
            ]
        };

        this.#dashboardView.querySelector("#orders5days").addEventListener("click", event => {
            new Chartist.Line('.ct-bar', ORDERS_FIVE_DAYS);

            this.#dashboardView.querySelector("#kind").innerHTML = " Number of"
            this.#dashboardView.querySelector("#orderOrEarn").innerHTML = " orders"
            this.#dashboardView.querySelector("#days").innerHTML = "5 days"
        });

        this.#dashboardView.querySelector("#ordersMonth").addEventListener("click", event => {
            new Chartist.Line('.ct-bar', ORDERS_FOUR_WEEKS);

            this.#dashboardView.querySelector("#kind").innerHTML = " Number of"
            this.#dashboardView.querySelector("#orderOrEarn").innerHTML = " orders"
            this.#dashboardView.querySelector("#days").innerHTML = "4 weeks"
        });

        this.#dashboardView.querySelector("#earnings5days").addEventListener("click", event => {
            new Chartist.Line('.ct-bar', EARNINGS_FIVE_DAYS);

            this.#dashboardView.querySelector("#kind").innerHTML = " Earnings"
            this.#dashboardView.querySelector("#orderOrEarn").innerHTML = ""
            this.#dashboardView.querySelector("#days").innerHTML = "5 days"
        });

        this.#dashboardView.querySelector("#earningsMonth").addEventListener("click", event => {
            new Chartist.Line('.ct-bar', EARNINGS_FOUR_WEEKS);

            this.#dashboardView.querySelector("#kind").innerHTML = " Earnings"
            this.#dashboardView.querySelector("#orderOrEarn").innerHTML = ""
            this.#dashboardView.querySelector("#days").innerHTML = "4 weeks"
        });

        new Chartist.Line('.ct-bar', ORDERS_FIVE_DAYS);
    }

    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrdersFromUser(this.#ID);
        const maxOrders = 8

        for (let i = 0; i < maxOrders; i++) {
            let data = orderData[i];
            const table = this.#dashboardView.querySelector("#order-table");
            let tableRow = table.insertRow()
            let orderCell = tableRow.insertCell()
            let nameCell = tableRow.insertCell()
            let adresCell = tableRow.insertCell()

            orderCell.append(data.order_id);
            nameCell.append(data.shipping_name);
            adresCell.append(data.shipping_address);

            table.append(tableRow);
        }
    }

    async #fetchOrderCountOmw() {
        const amount = await this.#ordersRepository.countOrdersOmw(this.#ID);
        this.#dashboardView.querySelector("#orders-omw").innerHTML = amount.amount
    }

    async #fetchOrderCountHere() {
        const amount = await this.#ordersRepository.countOrdersHere(this.#ID);

        this.#dashboardView.querySelector("#orders-delivered").innerHTML = amount.amount
    }

    async #fetchEarningsToday() {
        const amount = await this.#ordersRepository.calculateEarningsToday(this.#ID);
        if (amount.price == null) {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = amount.price
        }
    }

    async #fetchEarningsWeek() {
        const amount = await this.#ordersRepository.calculateEarningsWeek(this.#ID);

        if (amount.price == null) {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = amount.price
        }
    }

    async #fetchEarningsMonth() {
        const amount = await this.#ordersRepository.calculateEarningsMonth(this.#ID);
        if (amount.price == null) {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = amount.price
        }
    }

    async #fetchCollectedMoney() {
        const DATA = await this.#ordersRepository.calculateDonatedMoney(this.#ID);

        const amount = (Math.round(data.donatie * 100) / 100).toFixed(2);
        this.#dashboardView.querySelector("#collected-money").innerHTML = amount
    }
}

