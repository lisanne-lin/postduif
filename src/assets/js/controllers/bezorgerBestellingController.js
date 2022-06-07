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

		for (let i = 0; i < orderData.length; i++) {
			let data = orderData[i];
			let name = getCompanyName[i];
			let orderDetail = document.createElement("div");
			orderDetail.classList.add("order-detail");
			orderDetail.setAttribute("id", data.bestelnummer);
			let orderDate = document.createElement("p");
			orderDate.classList.add("date");
			let company = document.createElement("p");
			company.classList.add("company-name");
			let orderZipcode = document.createElement("p");
			orderZipcode.classList.add("zipcode");
			let orderNumber = document.createElement("p");
			orderNumber.classList.add("order-number");
			let orderStatus = document.createElement("p");
			orderStatus.classList.add("order-status");

			orderDetail.appendChild(orderDate);
			orderDetail.appendChild(company);
			orderDetail.appendChild(orderNumber);
			orderDetail.appendChild(orderZipcode);
			orderDetail.appendChild(orderStatus);

			orderDate.innerHTML = data.geschatte_bezorgdatum;
			company.innerHTML = name.naam;
			orderNumber.innerHTML = "Order " + data.bestelnummer;
			orderZipcode.innerHTML = data.verzend_postcode;
			orderStatus.innerHTML = data.status;
			console.log(data.status);

			switch (data.status) {
				case "Order Cancelled":
					orderStatus.classList.add("order-cancelled");
					break;
				case "On the way":
					orderStatus.classList.add("on-the-way");
					break;
				case "Order delivered":
					orderStatus.classList.add("delivered");
					break;
				case "Still to be picked up":
					orderStatus.classList.add("pickup");
			}

			document.querySelector(".order-list").appendChild(orderDetail);
		}

		/**
		 * For every order, get id, and forward the id to another controller
		 */
		document.querySelectorAll(".order-detail").forEach((order) => {
			const id = order.getAttribute("id");
			order.addEventListener("click", (event) => {
				App.loadController(App.CONTROLLER_ORDER_DETAIL, { id });
			});
		});
	}
}
