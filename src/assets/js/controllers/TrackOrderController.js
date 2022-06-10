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

    /**
     * setusp page with the navba, html file and runs the funcions
     * @returns {Promise<void>}
     */
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
        this.#ID = CUSTOMER_ID[0].customer_id

        const CUSTOMER_DATA = await this.#customersRepository.getCustomerById(this.#ID);

        this.#trackView.querySelector("#welcomename").innerHTML = CUSTOMER_ID[0].first_name

        await this.#getOrderHistory()
    }

    /**
     * Gets the order History from the client
     * @returns {Promise<void>}
     */
    async #getOrderHistory() {
        const orders = await this.#customersRepository.getOrdersFromCustomer(this.#ID);

        if (orders.length !== 0) {
            for (let i = 0; i < orders.length; i++) {
                let template = document.getElementById("client_order_template");

                let cloneTemplate = template.content.cloneNode(true);

                cloneTemplate.querySelector("#business_name").innerHTML = orders[i].name
                cloneTemplate.querySelector("#adress-client").innerHTML = orders[i].shipping_address
                cloneTemplate.querySelector("#month").innerHTML = orders[i].month
                cloneTemplate.querySelector("#day").innerHTML = orders[i].day
                cloneTemplate.querySelector("#year").innerHTML = orders[i].year
                cloneTemplate.querySelector("#price").innerHTML = orders[i].price
                cloneTemplate.querySelector("#order-status").innerHTML = orders[i].status
                cloneTemplate.querySelector("#order-number").innerHTML = orders[i].order_id

                cloneTemplate.querySelector("#viewInfoBtn").addEventListener("click", async event => {
                    const orderData = await this.#ordersRepository.getOrderByOrderNum(orders[i].order_id)

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

                    let estimated_delivery = orderData[0].estimated_delivery

                    orderNum.innerHTML = orderData[0].order_id
                    orderName.innerHTML = orderData[0].shipping_name
                    orderStreet.innerHTML = orderData[0].shipping_address
                    orderZip.innerHTML = orderData[0].shipping_zip

                    orderRemark.value = orderData[0].remark
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

                    orderEstimate.innerHTML = estimated_delivery
                    orderEntrepreneurName.innerHTML = orderData[0].name
                    orderEntrepreneurAdress.innerHTML = orderData[0].address
                    orderEntrepreneurZip.innerHTML = orderData[0].zip

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

    /**
     * Searches an order using orderNum and the zip from the order
     * @param num
     * @param zip
     * @returns {Promise<void>}
     */
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

            let estimated_delivery = orderData[0].estimated_delivery
            estimated_delivery = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);

            orderNum.innerHTML = orderData[0].order_id
            orderName.innerHTML = orderData[0].shipping_name
            orderStreet.innerHTML = orderData[0].shipping_address
            orderZip.innerHTML = orderData[0].shipping_zip

            orderRemark.value = orderData[0].remark
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

            orderEstimate.innerHTML = estimated_delivery
            orderEntrepreneurName.innerHTML = orderData[0].name
            orderEntrepreneurAdress.innerHTML = orderData[0].address
            orderEntrepreneurZip.innerHTML = orderData[0].zip

            this.#trackView.querySelector("#order-found").style.display = "block";
            this.#trackView.querySelector("#order-not-found").style.display = "none";
            this.#trackView.querySelector("#save-btn").style.display = "block";

            this.#trackView.querySelector("#save-btn").addEventListener("click", event => {
                this.#ordersRepository.saveOrder(orderData[0].order_id, this.#ID)
            })
        } catch (e) {
            this.#trackView.querySelector("#order-found").style.display = "none";
            this.#trackView.querySelector("#order-not-found").style.display = "block";
            this.#trackView.querySelector("#save-btn").style.display = "none";
        }
    }
}
