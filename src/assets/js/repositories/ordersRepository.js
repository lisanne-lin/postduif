/**
 * Repository voor Entity Orders
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class OrdersRepository {
	#networkManager;
	#route;

	constructor() {
		this.#route = "/order";
		this.#networkManager = new NetworkManager();
	}

	async createOrder(
		order_id,
		shipping_name,
		shipping_address,
		shipping_place,
		shipping_zip,
		estimated_delivery,
		shipping_date,
		delivery_charge,
		remark,
		delivery_person_id,
		customer_id,
		entrepreneur_id,
		order_date,
		status,
		price
	) {
		return await this.#networkManager.doRequest(this.#route, "POST", {
			order_id: order_id,
			shipping_name: shipping_name,
			shipping_address: shipping_address,
			shipping_place: shipping_place,
			shipping_zip: shipping_zip,
			estimated_delivery: estimated_delivery,
			shipping_date: shipping_date,
			delivery_charge: delivery_charge,
			remark: remark,
			delivery_person_id: delivery_person_id,
			customer_id: customer_id,
			entrepreneur_id: entrepreneur_id,
			order_date: order_date,
			status: status,
			price: price,
		});
	}

	async getOrdersFromUser(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrdersFromUser/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async deleteOrder(order_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/deleteOrder/${order_id}`,
			"DELETE",
			{}
		);
	}

	async saveOrder(order_id, customer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/saveorder/${order_id}/${customer_id}`,
			"PUT",
			{}
		);
	}

	async getOrderByInfo(info) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderByInfo/${info}/${info}/${info}/${info}`,
			"GET"
		);
	}

	async getTodaysOrder(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getTodaysOrder/${entrepreneur_id}`,
			"GET"
		);
	}

	async getYesterdaysOrder(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getYesterdaysOrder/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataTwoDaysAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataTwoDaysAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataThreeDaysAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataThreeDaysAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataFourDaysAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataFourDaysAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataFiveDaysAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataFiveDaysAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataSevenDaysAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataSevenDaysAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataTwoWeeksAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataTwoWeeksAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataThreeWeeksAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataThreeWeeksAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrderDataFourWeeksAgo(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataFourWeeksAgo/${entrepreneur_id}`,
			"GET"
		);
	}

	async getOrders() {
		return await this.#networkManager.doRequest(
			`${this.#route}/getallfor`,
			"GET",
			{}
		);
	}

	async getOrderByOrderNum(order_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getorder/${order_id}`,
			"GET"
		);
	}

	async getOrderByOrderNumAndZip(order_id, zip) {
		return await this.#networkManager.doRequest(
			`${this.#route}/trackorder/${order_id}/${zip}`,
			"GET"
		);
	}

	async countOrders(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/count/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async deleteOrders(order_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/delete/${order_id}`,
			"POST",
			{}
		);
	}

	async countOrdersOmw(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/countomw/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async countOrdersHere(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/counthere/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsToday(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningstoday/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsYesterday(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningsyesterday/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsWeek(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningsweek/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsLastWeek(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningslastweek/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsMonth(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningsmonth/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsLastMonth(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningslastmonth/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	async calculateDonatedMoney(entrepreneur_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculatedonatedmoney/${entrepreneur_id}`,
			"GET",
			{}
		);
	}

	/**
	 *
	 * @param {*} id
	 * @returns
	 */
	async getCompanyName(id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getcompanyname/${id}`,
			"GET"
		);
	}
	/**
	 * haalt het telefoonnummer op met het order_id
	 *
	 * @param {number} order_id
	 * @returns telefoonnummer van de bestelling
	 */
	async getPhonenumber(order_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getphonenumber/${order_id}`,
			"GET"
		);
	}

	/**
	 * Update de status van een bestelling
	 *
	 * @param {number} orderId order_id
	 * @param {string} status status van het bestelling
	 * @returns
	 */
	async updateStatus(orderId, status) {
		return await this.#networkManager.doRequest(
			`${this.#route}/${orderId}/status`,
			"PUT",
			{ status: status }
		);
	}
}
