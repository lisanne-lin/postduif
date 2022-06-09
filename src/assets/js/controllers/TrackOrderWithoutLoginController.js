import {Controller} from "./controller.js";
import {App} from "../app.js";
import {OrdersRepository} from "../repositories/ordersRepository.js";

export class TrackOrderWithoutLoginController extends Controller {
	#trackView;
	#ordersRepository;

	constructor() {
		super();
		this.#setup();
		this.#ordersRepository = new OrdersRepository();
	}

	async #setup() {
		App.loadController(App.CONTROLLER_NAVBAR_CLIENT);

		this.#trackView = await super.loadHtmlIntoContent(
			"html_views/trackorder_without_login.html"
		);
		document.querySelector("#nav-settings").style.display = "none";
		document.querySelector("#nav-track").style.display = "none";
		document.querySelector("#nav-logout").style.display = "none";

		this.#trackView
			.querySelector("#search-btn")
			.addEventListener("click", (event) => {
				this.#fetchOrderByNumAndZip(
					this.#trackView.querySelector("#tracktrace").value,
					this.#trackView.querySelector("#input-zip").value
				);
			});

		//from here we can safely get elements from the view via the right getter
		const anchors = this.#trackView.querySelectorAll("button");
		//set click listener on each anchor
		anchors.forEach((anchor) =>
			anchor.addEventListener("click", (event) =>
				this.#handleClickNavigationItem(event)
			)
		);
	}

	#handleClickNavigationItem(event) {
		//Get the data-controller from the clicked element (this)
		const clickedAnchor = event.target;
		const controller = clickedAnchor.dataset.controller;

		if (typeof controller === "undefined") {
			console.error(
				"No data-controller attribute defined in anchor HTML tag, don't know which controller to load!"
			);
			return false;
		}

		//TODO: You should add highlighting of correct anchor when page is active :)

		//Pass the action to a new function for further processing

		App.loadController(controller);

		//Return false to prevent reloading the page
		return false;
	}

	async #fetchOrderByNumAndZip(num, zip) {
		try {
			const orderData =
				await this.#ordersRepository.getOrderByOrderNumAndZip(num, zip);

			const now = new Date();

			let orderStatus = this.#trackView.querySelector("#status");
			let orderEstimate = this.#trackView.querySelector("#estimated");

			let orderName = this.#trackView.querySelector("#name");
			let orderStreet = this.#trackView.querySelector("#adress");
			let orderZip = this.#trackView.querySelector("#zip");

			let orderEntrepreneurName =
				this.#trackView.querySelector("#entrepreneur-name");
			let orderEntrepreneurAdress = this.#trackView.querySelector(
				"#entrepreneur-adress"
			);
			let orderEntrepreneurZip =
				this.#trackView.querySelector("#entrepreneur-zip");

			let orderNum = this.#trackView.querySelector("#order-num");

			let orderRemark = this.#trackView.querySelector("#message-text");

			let estimated_delivery = orderData[0].estimated_delivery;
			estimated_delivery = new Date(
				now.getTime() - now.getTimezoneOffset() * 60000
			)
				.toISOString()
				.substring(0, 19);

			orderNum.innerHTML = orderData[0].order_id;
			orderName.innerHTML = orderData[0].shipping_name;
			orderStreet.innerHTML = orderData[0].shipping_address;
			orderZip.innerHTML = orderData[0].shipping_zip;

			orderRemark.value = orderData[0].remark;
			orderStatus.innerHTML = orderData[0].status;

			switch (orderData[0].status) {
				case "On the way":
					this.#trackView.querySelector("#order-image").src =
						"/assets/img/undraw_ride_a_bicycle_re_6tjy.svg";
					this.#trackView.querySelector("#bar").style.width = "66%";
					break;
				case "Delivered":
					this.#trackView.querySelector("#order-image").src =
						"/assets/img/undraw_package_arrived_63rf (1).svg";
					this.#trackView.querySelector("#bar").style.width = "100%";
					break;
				case "Still to be picked up":
					this.#trackView.querySelector("#order-image").src =
						"/assets/img/undraw_time_management_re_tk5w.svg";
					this.#trackView.querySelector("#bar").style.width = "33%";
					break;
				default:
			}

			orderEstimate.innerHTML = estimated_delivery;
			orderEntrepreneurName.innerHTML = orderData[0].name;
			orderEntrepreneurAdress.innerHTML = orderData[0].address;
			orderEntrepreneurZip.innerHTML = orderData[0].zip;

			this.#trackView.querySelector("#order-found").style.display =
				"block";
			this.#trackView.querySelector("#order-not-found").style.display =
				"none";
			this.#trackView.querySelector("#save-btn").style.display = "block";
		} catch (e) {
			this.#trackView.querySelector("#order-found").style.display =
				"none";
			this.#trackView.querySelector("#order-not-found").style.display =
				"block";
			this.#trackView.querySelector("#save-btn").style.display = "none";
		}
	}
}
