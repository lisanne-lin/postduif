/**
 * Controller for getting deliveries
 * @author Lisanne Lin
 */

import { OrdersRepository } from "../repositories/ordersRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class bezorgerBestellingController extends Controller {
  #ordersRepository;
  #createBezorgerBestellingView;

  constructor(id) {
    super();
    this.#ordersRepository = new OrdersRepository();
    this.#setupView();
    console.log(id);


  }

  async #setupView() {
    this.#createBezorgerBestellingView = await super.loadHtmlIntoContent(
      "html_views/bezorger_bestelling-lijst.html"
    );
    this.#fetchOrders();
  }

  async #fetchOrders() {
    const orderData = await this.#ordersRepository.getOrders();
    const getCompanyName = await this.#ordersRepository.getCompanyName();
    console.log(orderData);
    console.log(getCompanyName);

    for (let i = 0; i < 20; i++) {
      let data = orderData[i];
      let name = getCompanyName[i];
      let orderDetail = document.createElement("div");
      orderDetail.classList.add("order-detail");
      orderDetail.setAttribute("id", data.bestelnummer);

      let orderDate = document.createElement("p");
      orderDate.classList.add("date");
      let company = document.createElement("p");
      company.classList.add("company-name");
      let orderNumber = document.createElement("p");
      orderNumber.classList.add("order-number");

      orderDetail.appendChild(orderDate);
      orderDetail.appendChild(company);
      orderDetail.appendChild(orderNumber);

      orderDate.innerHTML = data.geschatte_bezorgdatum;
      company.innerHTML = name.naam;
      orderNumber.innerHTML = data.bestelnummer;

      document.querySelector(".order-list").appendChild(orderDetail);
    }
    // document.querySelector(".order-detail").addEventListener("click", event => {
    //     App.loadController(App.CONTROLLER_ORDER_DETAIL);
    // })

    document.querySelectorAll(".order-detail").forEach((order) => {
      const id = order.getAttribute("id");
      order.addEventListener("click", (event) => {
        App.loadController(App.CONTROLLER_ORDER_DETAIL, { id });
      });
    });
  }
}
