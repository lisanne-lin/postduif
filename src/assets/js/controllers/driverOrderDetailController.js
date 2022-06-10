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
	 * Displays information of an order
	 *
	 * @param {number} id  order id of an order
	 */
	async #fetchOrder(id) {
		//gets orders with order id
		const orderData = await this.#ordersRepository.getOrderByOrderNum(id);
		const getCompanyName = await this.#ordersRepository.getCompanyName(id);
		//gets phonenumber of the order
		const phonenumber = await this.#ordersRepository.getPhonenumber(id);
		console.log(orderData[0].order_id);
		document.getElementById("orderStatus").innerHTML = orderData[0].status;
		document.getElementById("customerName").innerHTML =
			orderData[0].shipping_name;
		document.getElementById("naam").innerHTML = orderData[0].shipping_name;
		document.getElementById("companyName").innerHTML =
			getCompanyName[0].name;
		document.getElementById("ordernumber").innerHTML =
			orderData[0].order_id;
		document.getElementById("date").innerHTML = orderData[0].shipping_date;
		document.getElementById("adres").innerHTML =
			orderData[0].shipping_address;
		document.getElementById("zip").innerHTML = orderData[0].shipping_zip;
		document.getElementById("city").innerHTML = orderData[0].shipping_place;
		document.getElementById("phonenumber").innerHTML =
			phonenumber.length !== 0 ? phonenumber[0].phonenumber : "";

		const outForDelivery = document.getElementById("outForDelivery");
		const pickupButton = document.getElementById("pickOrder");
		const cancelButton = document.getElementById("cancel");
		const backButton = document.getElementById("back");
		const cancelOrder = document.getElementById("cancelOrder");
		const deliveredButton = document.getElementById("orderDelivered");
		backButton.addEventListener("click", (event) => {
			App.loadController(App.CONTROLLER_BEZORGER_BESTELLING);
		});

		// leaflet map with osm tilelayer
		var map = L.map("map").setView([28.238, 83.9956], 11);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

		// marker
		var marker = L.marker([28.238, 83.9956]).addTo(map);

		/**
		 * Use openrouteservice API to find location information of the given address
		 *
		 * @param {string} address to find information for
		 * @returns location information of the given address (coordination etc)
		 */
		const findAddress = async (address) => {
			return await fetch(
				`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248ed7e94a50da54720aeba66e7244e45a7&text=${address}&boundary.country=NL`
			)
				.then((res) => res.json())
				.then((data) => {
					return data.features[0];
				});
		};
		const orderAddress = await findAddress(
			`${orderData[0].shipping_address} ${orderData[0].shipping_zip} ${orderData[0].shipping_place}`
		);
		const businessAddress = await findAddress(
			`${orderData[0].address} ${orderData[0].zip} ${orderData[0].place}`
		);
		L.Routing.control({
			waypoints: [
				L.latLng(
					//converts business address to coordinates
					businessAddress.geometry.coordinates[1],
					businessAddress.geometry.coordinates[0]
				),
				L.latLng(
					//converts customer address to coordinates
					orderAddress.geometry.coordinates[1],
					orderAddress.geometry.coordinates[0]
				),
			],
		}).addTo(map);

		outForDelivery.style.display = "none";
		cancelButton.style.display = "none";
		deliveredButton.style.display = "none";
		cancelOrder.style.display = "none";
		pickupButton.style.display = "none";

		outForDelivery.addEventListener("click", () =>
			this.#ordersRepository.updateStatus(id, "On the way")
		);

		deliveredButton.addEventListener("click", () =>
			this.#ordersRepository.updateStatus(id, "Delivered")
		);

		cancelOrder.addEventListener("click", () =>
			this.#ordersRepository.updateStatus(id, "Order Cancelled")
		);

		pickupButton.onclick = function () {
			outForDelivery.style.display = "block";
			pickupButton.style.display = "none";
			backButton.style.display = "block";
		};

		outForDelivery.onclick = function () {
			pickupButton.style.display = "none";
			outForDelivery.style.display = "none";
			pickupButton.classList.add("disabled");
			deliveredButton.style.display = "block";
			orderStatus.classList.remove("pickup");
			orderStatus.classList.add("on-the-way");
		};

		deliveredButton.onclick = function () {
			deliveredButton.style.display = "none";
			orderStatus.classList.remove("on-the-way");
			orderStatus.classList.add("delivered");
		};

		switch (orderData[0].status) {
			case "Still to be picked up":
				orderStatus.classList.add("pickup");
				pickupButton.style.display = "block";
				break;

			case "On the way":
				orderStatus.classList.add("on-the-way");
				deliveredButton.style.display = "block";
				break;

			case "Delivered":
				orderStatus.classList.add("delivered");
				deliveredButton.style.display = "block";
				break;

			case "Order Cancelled":
				cancelButton.style.display = "block";
				break;

			default:
				break;
		}
	}
}
