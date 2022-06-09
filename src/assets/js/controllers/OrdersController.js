/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 * uhuh
 * @author Lennard Fonteijn & Pim Meijer
 */

import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class OrdersController extends Controller {
	#ordersRepository;
	#entrepreneursRepository;
	#orderView;
	#ID;

	constructor() {
		super();
		this.#ordersRepository = new OrdersRepository();
		this.#entrepreneursRepository = new EntrepreneursRepository();
		this.#setupView();
	}

	/**
	 * Loads contents of desired HTML file into the index.html .content div
	 * @returns {Promise<>}
	 * @private
	 */
	async #setupView() {
		App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
		const ENTREPRENEUR_ID =
			await this.#entrepreneursRepository.getUserIdByEmail(
				App.sessionManager.get("username")
			);
		this.#ID = ENTREPRENEUR_ID[0].entrepreneur_id;

		this.#orderView = await super.loadHtmlIntoContent(
			"html_views/orders.html"
		);
		document.querySelector(".navbar").style.display = "block";
		document.querySelector("#nav-orders").className = "nav-link active";
		document.querySelector("#nav-dash").className = "nav-link";

		this.#orderView
			.querySelector("#place-order-btn")
			.addEventListener("click", (event) => {
				App.loadController(event.target.dataset.controller);
			});

		this.#orderView
			.querySelector("#search-order-btn")
			.addEventListener("click", (event) => {
				this.#fetchOrdersByInfo(
					this.#orderView.querySelector("#search-order-input").value
				);
			});

		await this.#fetchOrders();
	}

	async #fetchOrders() {
		const ORDER_DATA = await this.#ordersRepository.getOrdersFromUser(
			this.#ID
		);

		for (let i = 0; i < ORDER_DATA.length; i++) {
			let data = ORDER_DATA[i];
			const TABLE = this.#orderView.querySelector("#orders-tbody");
			let TABLERow = TABLE.insertRow();
			let orderCell = TABLERow.insertCell();
			let nameCell = TABLERow.insertCell();
			let adresCell = TABLERow.insertCell();
			let residenceCell = TABLERow.insertCell();
			let zipCell = TABLERow.insertCell();
			let statusCell = TABLERow.insertCell();

			orderCell.append(data.order_id);
			nameCell.append(data.shipping_name);
			adresCell.append(data.shipping_address);
			residenceCell.append(data.shipping_place);
			zipCell.append(data.shipping_zip);
			statusCell.append(data.status);

			TABLERow.dataset.target = "#exampleModal";
			TABLERow.dataset.toggle = "modal";

			TABLERow.addEventListener("click", async (event) => {
				await this.#fetchOrderDetails(data.order_id);
			});
		}
	}

	async #deleteOrder(orderNum) {
		await this.#ordersRepository.deleteOrder(orderNum);
	}

	async #fetchOrderDetails(orderNumber) {
		const ORDER_DATA = await this.#ordersRepository.getOrderByOrderNum(
			orderNumber
		);

		let orderStatus = this.#orderView.querySelector("#status");
		let orderName = this.#orderView.querySelector("#name");
		let orderStreet = this.#orderView.querySelector("#adress");
		let orderZip = this.#orderView.querySelector("#zip");
		let orderEntrepreneurName =
			this.#orderView.querySelector("#entrepreneur-name");
		let orderEntrepreneurAdress = this.#orderView.querySelector(
			"#entrepreneur-adress"
		);
		let orderEntrepreneurZip =
			this.#orderView.querySelector("#entrepreneur-zip");
		let orderRemark = this.#orderView.querySelector("#entrepreneur-remark");
		let orderNum = this.#orderView.querySelector("#order-number");
		let orderPrice = this.#orderView.querySelector("#price");
		let orderDate = this.#orderView.querySelector("#orderDate");
		let orderDeliveryCharge =
			this.#orderView.querySelector("#deliveryCharge");

		orderNum.innerHTML = ORDER_DATA[0].order_id;
		orderName.innerHTML = ORDER_DATA[0].shipping_name;
		orderStreet.innerHTML = ORDER_DATA[0].shipping_address;
		orderZip.innerHTML = ORDER_DATA[0].shipping_zip;
		orderRemark.innerHTML = ORDER_DATA[0].remark;
		orderStatus.innerHTML = ORDER_DATA[0].status;
		orderEntrepreneurName.innerHTML = ORDER_DATA[0].name;
		orderEntrepreneurAdress.innerHTML = ORDER_DATA[0].address;
		orderEntrepreneurZip.innerHTML = ORDER_DATA[0].zip;
		orderPrice.innerHTML = ORDER_DATA[0].prijs;
		(orderDate.innerHTML =
			ORDER_DATA[0].month +
			" " +
			ORDER_DATA[0].day +
			", " +
			ORDER_DATA[0].year),
			(orderDeliveryCharge.innerHTML = ORDER_DATA[0].delivery_charge);

		this.#orderView
			.querySelector("#delete-btn-modal")
			.addEventListener("click", async (event) => {
				await this.#deleteOrder(ORDER_DATA[0].order_id);
				App.loadController(App.CONTROLLER_ORDERS);
			});
	}

	async #fetchOrdersByInfo(info) {
		const ORDER_DATA = await this.#ordersRepository.getOrderByInfo(info);
		this.#orderView.querySelector("#orders-tbody").remove();

		for (let i = 0; i < 60; i++) {
			let data = ORDER_DATA[i];
			const TABLE = this.#orderView.querySelector("#order-TABLE");
			let TABLERow = TABLE.insertRow();
			let orderCell = TABLERow.insertCell();
			let nameCell = TABLERow.insertCell();
			let adresCell = TABLERow.insertCell();
			let residenceCell = TABLERow.insertCell();
			let zipCell = TABLERow.insertCell();
			let statusCell = TABLERow.insertCell();

			orderCell.append(data.order_id);
			nameCell.append(data.shipping_name);
			adresCell.append(data.shipping_address);
			residenceCell.append(data.shipping_place);
			zipCell.append(data.shipping_zip);
			statusCell.append(data.status);

			TABLERow.dataset.target = "#exampleModal";
			TABLERow.dataset.toggle = "modal";
			TABLE.className = "TABLE TABLE-hover";

			TABLERow.addEventListener("click", async (event) => {
				await this.#fetchOrderDetails(data.order_id);
			});
		}
	}
}
