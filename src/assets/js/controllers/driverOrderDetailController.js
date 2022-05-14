/**
 * Controller for getting deliveries
 * @author Lisanne Lin
 */

import { OrdersRepository } from "../repositories/ordersRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
export class driverOrderDetailController extends Controller {
  #ordersRepository;
  #driverOrderDetailController;

  constructor(data) {
    super();
    this.#ordersRepository = new OrdersRepository();
    this.#setupView(data.id);
  }

  async #setupView(id) {
    this.#driverOrderDetailController = await super.loadHtmlIntoContent(
      "html_views/order-page-details_deliverer.html"
    );
    this.#fetchOrder(id);
  }

  /**
   * pakt data van de order uit de database en laat het zien op de pagina
   * @param {number} id = bestelnummer van bestelling
   */
  async #fetchOrder(id) {
    // haalt de bestelling op met de bestelnummer
    const orderData = await this.#ordersRepository.getOrderByOrderNum(id);
    const getCompanyName = await this.#ordersRepository.getCompanyName(id);
    // pakt het telefoonnummer van de bestelling
    const getPhonenumber = await this.#ordersRepository.getPhonenumber(id);

    document.getElementById("customerName").innerHTML =
      orderData[0].verzendnaam;
    document.getElementById("naam").innerHTML = orderData[0].verzendnaam;
    document.getElementById("companyName").innerHTML = getCompanyName[0].naam;
    document.getElementById("ordernumber").innerHTML =
      orderData[0].bestelnummer;
    document.getElementById("date").innerHTML = orderData[0].verzend_datum;
    document.getElementById("adres").innerHTML = orderData[0].verzendadres;
    document.getElementById("zip").innerHTML = orderData[0].verzend_postcode;
    document.getElementById("phonenumber").innerHTML =
      getPhonenumber[0].telefoonnummer;

    console.log(getPhonenumber);

    const deliverButton = document.getElementById("deliverOrder");
    const pickupButton = document.getElementById("pickOrder");
    const cancelButton = document.getElementById("cancel");
    const backButton = document.getElementById("back");

    deliverButton.style.display = "none";
    cancelButton.style.display = "none";

    pickupButton.onclick = function () {
      deliverButton.style.display = "block";
      cancelButton.style.display = "block";

      pickupButton.style.display = "none";
      backButton.style.display = "none";

      console.log("click");
    };
    cancelButton.onclick = function () {
      deliverButton.style.display = "none";
      cancelButton.style.display = "none";

      pickupButton.style.display = "block";
      backButton.style.display = "block";
    };

    backButton.addEventListener("click", (event) => {
      App.loadController(App.CONTROLLER_BEZORGER_BESTELLING);
    });
  }
}
