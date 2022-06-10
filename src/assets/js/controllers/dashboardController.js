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

    /**
     * Loads in navbar and html file and runs all the functions
     * @returns {Promise<void>}
     */
    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
        const ENTREPRENEUR_ID = await this.#entrepreneursRepository.getUserIdByEmail(App.sessionManager.get("username"))
        this.#ID = ENTREPRENEUR_ID[0].entrepreneur_id;

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

    /**
     * Calculates the earnings percentages of the customers business
     * @returns {Promise<void>}
     */
    async #fetchPercentages() {
        const ORDER_DATA_TODAY = await this.#ordersRepository.calculateEarningsToday(this.#ID);
        const ORDER_DATA_YESTERDAY = await this.#ordersRepository.calculateEarningsYesterday(this.#ID);
        const ORDER_DATA_WEEK = await this.#ordersRepository.calculateEarningsWeek(this.#ID);
        const ORDER_DATA_LAST_WEEK = await this.#ordersRepository.calculateEarningsLastWeek(this.#ID);
        const ORDER_DATA_MONTH = await this.#ordersRepository.calculateEarningsMonth(this.#ID);
        const ORDER_DATA_LAST_MONTH = await this.#ordersRepository.calculateEarningsLastMonth(this.#ID);

        const PERCENTAGE_TODAY = (((ORDER_DATA_YESTERDAY.price - ORDER_DATA_TODAY.price) / ORDER_DATA_TODAY.price) * 100);
        const PERCENTAGE_WEEK = (((ORDER_DATA_LAST_WEEK.price - ORDER_DATA_WEEK.price) / ORDER_DATA_WEEK.price) * 100);
        const PERCENTAGE_MONTH = (((ORDER_DATA_LAST_MONTH.price - ORDER_DATA_MONTH.price) / ORDER_DATA_MONTH.price) * 100);

        this.#dashboardView.querySelector("#percentageday").innerHTML = PERCENTAGE_TODAY;
        this.#dashboardView.querySelector("#percentageweek").innerHTML = PERCENTAGE_WEEK;
        this.#dashboardView.querySelector("#percentagemonth").innerHTML = PERCENTAGE_MONTH;
    }

    /**
     * Fetches the data from the Entrpreneur
     * @returns {Promise<void>}
     */
    async #fetchEntrepreneurData() {
        const DATA = await this.#entrepreneursRepository.getEntrepreneurById(this.#ID);
        this.#dashboardView.querySelector("#businessOwner").innerHTML = DATA[0].owner;
        this.#dashboardView.querySelector("#businessName").innerHTML = DATA[0].name;
    }

    /**
     * Fetches the orderdata for the charts and puts the data in the charts
     * @returns {Promise<void>}
     */
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

        const EARNINGS_FOUR_WEEKS = {
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

    /**
     * fetches orderd and put the orders in a tiny table
     * @returns {Promise<void>}
     */
    async #fetchOrders() {
        const ORDER_DATA = await this.#ordersRepository.getOrdersFromUser(this.#ID);
        const MAX_ORDERS = 8

        for (let i = 0; i < MAX_ORDERS; i++) {
            const DATA = ORDER_DATA[i];
            const TABLE = this.#dashboardView.querySelector("#order-table");
            const TABLE_ROW = TABLE.insertRow()
            const ORDER_CELL = TABLE_ROW.insertCell()
            const NAME_CELL = TABLE_ROW.insertCell()
            const ADRESCELL = TABLE_ROW.insertCell()

            ORDER_CELL.append(DATA.order_id);
            NAME_CELL.append(DATA.shipping_name);
            ADRESCELL.append(DATA.shipping_address);

            TABLE.append(TABLE_ROW);
        }
    }

    /**
     * counts orders
     * @returns {Promise<void>}
     */
    async #fetchOrderCountOmw() {
        const AMOUNT = await this.#ordersRepository.countOrdersOmw(this.#ID);
        this.#dashboardView.querySelector("#orders-omw").innerHTML = AMOUNT.amount
    }

    /**
     * counts orders that are here
     * @returns {Promise<void>}
     */
    async #fetchOrderCountHere() {
        const AMOUNT = await this.#ordersRepository.countOrdersHere(this.#ID);

        this.#dashboardView.querySelector("#orders-delivered").innerHTML = AMOUNT.amount
    }

    /**
     * counts orders for today
     * @returns {Promise<void>}
     */
    async #fetchEarningsToday() {
        const AMOUNT = await this.#ordersRepository.calculateEarningsToday(this.#ID);
        if (AMOUNT.price == null) {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-today").innerHTML = AMOUNT.price
        }
    }

    /**
     * counts earnings for the week
     * @returns {Promise<void>}
     */
    async #fetchEarningsWeek() {
        const AMOUNT = await this.#ordersRepository.calculateEarningsWeek(this.#ID);

        if (AMOUNT.price == null) {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-week").innerHTML = AMOUNT.price
        }
    }

    /**
     * Counts earnings for this month
     * @returns {Promise<void>}
     */
    async #fetchEarningsMonth() {
        const AMOUNT = await this.#ordersRepository.calculateEarningsMonth(this.#ID);
        if (AMOUNT.price == null) {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = " -.--"
        } else {
            this.#dashboardView.querySelector("#earnings-month").innerHTML = AMOUNT.price
        }
    }

    /**
     * fetches the collected money
     * @returns {Promise<void>}
     */
    async #fetchCollectedMoney() {
        const DATA = await this.#ordersRepository.calculateDonatedMoney(this.#ID);

        const AMOUNT = (Math.round(DATA.donatie * 100) / 100).toFixed(2);
        this.#dashboardView.querySelector("#collected-money").innerHTML = AMOUNT
    }
}

