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
		const phonenumber = await this.#ordersRepository.getPhonenumber(id);

		document.getElementById("customerName").innerHTML =
			orderData[0].verzendnaam;
		document.getElementById("naam").innerHTML = orderData[0].verzendnaam;
		document.getElementById("companyName").innerHTML =
			getCompanyName[0].naam;
		document.getElementById("ordernumber").innerHTML =
			orderData[0].bestelnummer;
		document.getElementById("date").innerHTML = orderData[0].verzend_datum;
		document.getElementById("adres").innerHTML = orderData[0].verzendadres;
		document.getElementById("zip").innerHTML =
			orderData[0].verzend_postcode;
		document.getElementById("phonenumber").innerHTML =
			phonenumber.length !== 0 ? phonenumber[0].telefoonnummer : "";

		// const deliverButton = document.getElementById("deliverOrder");
		// const pickupButton = document.getElementById("pickOrder");
		// const cancelButton = document.getElementById("cancel");
		const backButton = document.getElementById("back");
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
			`${orderData[0].verzendadres} ${orderData[0].verzend_postcode} ${orderData[0].verzendplaats}`
		);
		const businessAddress = await findAddress(
			`${orderData[0].adres} ${orderData[0].postcode} ${orderData[0].plaats}`
		);
		L.Routing.control({
			waypoints: [
				L.latLng(
          businessAddress.geometry.coordinates[1],
					businessAddress.geometry.coordinates[0]
				),
				L.latLng(
          orderAddress.geometry.coordinates[1],
					orderAddress.geometry.coordinates[0]
				
				),
			],
		}).addTo(map);

		// deliverButton.style.display = "none";
		// cancelButton.style.display = "none";

		// pickupButton.onclick = function () {
		//   deliverButton.style.display = "block";
		//   cancelButton.style.display = "block";

		//   pickupButton.style.display = "none";
		//   backButton.style.display = "none";

		//   console.log("click");
		// };
		// cancelButton.onclick = function () {
		//   deliverButton.style.display = "none";
		//   cancelButton.style.display = "none";

		//   pickupButton.style.display = "block";
		//   backButton.style.display = "block";
		// };
	}
}
