import {Controller} from "./controller.js";
import {App} from "../app.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";

export class TrackOrderController extends Controller {

    #trackView;
    #ordersRepository

    constructor() {
        super();
        this.#setup();
        this.#ordersRepository = new OrdersRepository();
    }

    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_CLIENT);

        this.#trackView = await super.loadHtmlIntoContent("html_views/track_order.html");
        document.querySelector(".navbar").style.display = "block";

        this.#trackView.querySelector("#search-btn").addEventListener("click", event => {
            this.#fetchOrderByNumAndZip(this.#trackView.querySelector("#tracktrace").value, this.#trackView.querySelector("#input-zip").value);
        })
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
        } catch (e) {
            this.#trackView.querySelector("#order-found").style.display = "none";
            this.#trackView.querySelector("#order-not-found").style.display = "block";
            this.#trackView.querySelector("#save-btn").style.display = "none";

        }
    }

}
