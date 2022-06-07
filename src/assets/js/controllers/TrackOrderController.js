import {Controller} from "./controller.js";
import {App} from "../app.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";
import {CustomersRepository} from "../repositories/customersRepository.js";

export class TrackOrderController extends Controller {

    #trackView;
    #ordersRepository;
    #customersRepository;
    #ID;

    constructor() {
        super();
        this.#setup();
        this.#ordersRepository = new OrdersRepository();
        this.#customersRepository = new CustomersRepository();
    }

    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_CLIENT);

        this.#trackView = await super.loadHtmlIntoContent("html_views/track_order.html");

        document.querySelector(".navbar").style.display = "block";
        document.querySelector("#nav-settings").className = "nav-link";
        document.querySelector("#nav-track").className = "nav-link active";

        this.#trackView.querySelector("#search-btn").addEventListener("click", event => {
            this.#fetchOrderByNumAndZip(this.#trackView.querySelector("#tracktrace").value, this.#trackView.querySelector("#input-zip").value);
        })

        const CUSTOMER_ID = await this.#customersRepository.getUserIdByEmail(App.sessionManager.get("username"));
        this.#ID = CUSTOMER_ID[0].klantnummer

        const customerData = await this.#customersRepository.getCustomerById(this.#ID);

        this.#trackView.querySelector("#welcomename").innerHTML = CUSTOMER_ID[0].voornaam

        await this.#getOrderHistory()
    }

    async #getOrderHistory() {
        const orders = await this.#customersRepository.getOrdersFromCustomer(this.#ID);

        if (orders.length !== 0) {
            for (let i = 0; i < orders.length; i++) {
                let template = document.getElementById("client_order_template");

                let cloneTemplate = template.content.cloneNode(true);

                cloneTemplate.querySelector("#business_name").innerHTML = orders[i].naam
                cloneTemplate.querySelector("#adress-client").innerHTML = orders[i].verzendadres
                cloneTemplate.querySelector("#month").innerHTML = orders[i].bestelmaand
                cloneTemplate.querySelector("#day").innerHTML = orders[i].dag
                cloneTemplate.querySelector("#year").innerHTML = orders[i].jaar
                cloneTemplate.querySelector("#price").innerHTML = orders[i].prijs
                cloneTemplate.querySelector("#order-status").innerHTML = orders[i].status
                cloneTemplate.querySelector("#order-number").innerHTML = orders[i].bestelnummer

                cloneTemplate.querySelector("#viewInfoBtn").addEventListener("click", async event => {
                    const orderData = await this.#ordersRepository.getOrderByOrderNum(orders[i].bestelnummer)

                    let orderStatus = this.#trackView.querySelector("#status");
                    let orderEstimate = this.#trackView.querySelector("#estimated");

                    let orderName = this.#trackView.querySelector("#name");
                    let orderStreet = this.#trackView.querySelector("#adress");
                    let orderZip = this.#trackView.querySelector("#zip");

                    let orderEntrepreneurName = this.#trackView.querySelector("#entrepreneur-name");
                    let orderEntrepreneurAdress = this.#trackView.querySelector("#entrepreneur-adress");
                    let orderEntrepreneurZip = this.#trackView.querySelector("#entrepreneur-zip");

                    let orderNum = this.#trackView.querySelector("#order-num");

                    let orderRemark = this.#trackView.querySelector("#message-text");

                    let geschatte_bezorgdatum = orderData[0].geschatte_bezorgdatum
                    // geschatte_bezorgdatum = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);

                    orderNum.innerHTML = orderData[0].bestelnummer
                    orderName.innerHTML = orderData[0].verzendnaam
                    orderStreet.innerHTML = orderData[0].verzendadres
                    orderZip.innerHTML = orderData[0].verzend_postcode

                    orderRemark.value = orderData[0].opmerking
                    orderStatus.innerHTML = orderData[0].status

                    switch (orderData[0].status) {
                        case "On the way":
                            this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_ride_a_bicycle_re_6tjy.svg";
                            this.#trackView.querySelector("#bar").style.width = "66%";
                            break;
                        case "Delivered":
                            this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_package_arrived_63rf (1).svg";
                            this.#trackView.querySelector("#bar").style.width = "100%";
                            break;
                        case "Still to be picked up":
                            this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_time_management_re_tk5w.svg";
                            this.#trackView.querySelector("#bar").style.width = "33%";
                            break;
                        default:
                    }

                    orderEstimate.innerHTML = geschatte_bezorgdatum
                    orderEntrepreneurName.innerHTML = orderData[0].naam
                    orderEntrepreneurAdress.innerHTML = orderData[0].adres
                    orderEntrepreneurZip.innerHTML = orderData[0].postcode

                    this.#trackView.querySelector("#order-found").style.display = "block";
                    this.#trackView.querySelector("#order-not-found").style.display = "none";
                    this.#trackView.querySelector("#save-btn").style.display = "none";
                })

                document.getElementById("orders-history").appendChild(cloneTemplate);
            }
        } else {
            let text = document.createElement("p");

            text.innerHTML = "It looks like you don't have any orders yet..."

            document.getElementById("orders-history").appendChild(text);
        }
    }

    async #fetchOrderByNumAndZip(num, zip) {
        try {
            const orderData = await this.#ordersRepository.getOrderByOrderNumAndZip(num, zip);

            const now = new Date();

            let orderStatus = this.#trackView.querySelector("#status");
            let orderEstimate = this.#trackView.querySelector("#estimated");

            let orderName = this.#trackView.querySelector("#name");
            let orderStreet = this.#trackView.querySelector("#adress");
            let orderZip = this.#trackView.querySelector("#zip");

            let orderEntrepreneurName = this.#trackView.querySelector("#entrepreneur-name");
            let orderEntrepreneurAdress = this.#trackView.querySelector("#entrepreneur-adress");
            let orderEntrepreneurZip = this.#trackView.querySelector("#entrepreneur-zip");

            let orderNum = this.#trackView.querySelector("#order-num");

            let orderRemark = this.#trackView.querySelector("#message-text");

            let geschatte_bezorgdatum = orderData[0].geschatte_bezorgdatum
            geschatte_bezorgdatum = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);

            orderNum.innerHTML = orderData[0].bestelnummer
            orderName.innerHTML = orderData[0].verzendnaam
            orderStreet.innerHTML = orderData[0].verzendadres
            orderZip.innerHTML = orderData[0].verzend_postcode

            orderRemark.value = orderData[0].opmerking
            orderStatus.innerHTML = orderData[0].status

            switch (orderData[0].status) {
                case "On the way":
                    this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_ride_a_bicycle_re_6tjy.svg";
                    this.#trackView.querySelector("#bar").style.width = "66%";
                    break;
                case "Delivered":
                    this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_package_arrived_63rf (1).svg";
                    this.#trackView.querySelector("#bar").style.width = "100%";
                    break;
                case "Still to be picked up":
                    this.#trackView.querySelector("#order-image").src = "/assets/img/undraw_time_management_re_tk5w.svg";
                    this.#trackView.querySelector("#bar").style.width = "33%";
                    break;
                default:
            }

            orderEstimate.innerHTML = geschatte_bezorgdatum
            orderEntrepreneurName.innerHTML = orderData[0].naam
            orderEntrepreneurAdress.innerHTML = orderData[0].adres
            orderEntrepreneurZip.innerHTML = orderData[0].postcode

            this.#trackView.querySelector("#order-found").style.display = "block";
            this.#trackView.querySelector("#order-not-found").style.display = "none";
            this.#trackView.querySelector("#save-btn").style.display = "block";

            this.#trackView.querySelector("#save-btn").addEventListener("click", event => {
                this.#ordersRepository.saveOrder(orderData[0].bestelnummer, this.#ID)
            })
        } catch (e) {
            this.#trackView.querySelector("#order-found").style.display = "none";
            this.#trackView.querySelector("#order-not-found").style.display = "block";
            this.#trackView.querySelector("#save-btn").style.display = "none";
        }
    }
}
