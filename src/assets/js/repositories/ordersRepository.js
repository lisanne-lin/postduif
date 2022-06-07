/**
 * Repository voor Entity Orders
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class OrdersRepository {
	#networkManager;
	#route;

	constructor() {
		this.#route = "/bestelling";
		this.#networkManager = new NetworkManager();
	}

	async createOrder(
		bestelnummer,
		verzendnaam,
		verzendadres,
		verzendplaats,
		verzend_postcode,
		geschatte_bezorgdatum,
		verzend_datum,
		bezorgkosten,
		opmerking,
		Bezorger_bezorger_id,
		Klant_klantnummer,
		Ondernemer_ondernemer_id,
		besteldatum,
		status,
		prijs
	) {
		return await this.#networkManager.doRequest(this.#route, "POST", {
			bestelnummer: bestelnummer,
			verzendnaam: verzendnaam,
			verzendadres: verzendadres,
			verzendplaats: verzendplaats,
			verzend_postcode: verzend_postcode,
			geschatte_bezorgdatum: geschatte_bezorgdatum,
			verzend_datum: verzend_datum,
			bezorgkosten: bezorgkosten,
			opmerking: opmerking,
			Bezorger_bezorger_id: Bezorger_bezorger_id,
			Klant_klantnummer: Klant_klantnummer,
			Ondernemer_ondernemer_id: Ondernemer_ondernemer_id,
			besteldatum: besteldatum,
			status: status,
			prijs: prijs,
		});
	}

	async getOrderNumFromEmailAndName() {

	}

	async getOrdersFromUser(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrdersFromUser/${Ondernemer_ondernemer_id}`, "PUT", {}
		);
	}

	async saveOrder(bestelnummer, Klant_klantnummer) {
		return await this.#networkManager.doRequest(
			`${this.#route}/saveorder/${bestelnummer}/${Klant_klantnummer}`,
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

	async getTodaysOrder(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getTodaysOrder/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getYesterdaysOrder(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getYesterdaysOrder/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataTwoDaysAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getOrderDataTwoDaysAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataThreeDaysAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataThreeDaysAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataFourDaysAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataFourDaysAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataFiveDaysAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataFiveDaysAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataSevenDaysAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataSevenDaysAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataTwoWeeksAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataTwoWeeksAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataThreeWeeksAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataThreeWeeksAgo/${Ondernemer_ondernemer_id}`,
			"GET"
		);
	}

	async getOrderDataFourWeeksAgo(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/getOrderDataFourWeeksAgo/${Ondernemer_ondernemer_id}`,
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

	async getOrderByOrderNum(bestelnummer) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getorder/${bestelnummer}`,
			"GET"
		);
	}

	async getOrderByOrderNumAndZip(bestelnummer, zip) {
		return await this.#networkManager.doRequest(
			`${this.#route}/trackorder/${bestelnummer}/${zip}`,
			"GET"
		);
	}

	async countOrders(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/count/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async deleteOrders(bestelnummer) {
		return await this.#networkManager.doRequest(
			`${this.#route}/delete/${bestelnummer}`,
			"POST",
			{}
		);
	}

	async countOrdersOmw(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/countomw/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async countOrdersHere(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/counthere/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsToday(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningstoday/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsYesterday(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/calculateearningsyesterday/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsWeek(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/calculateearningslastweek/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsLastWeek(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/calculateearningslastweek/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsMonth(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculateearningsmonth/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateEarningsLastMonth(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${
				this.#route
			}/calculateearningslastmonth/${Ondernemer_ondernemer_id}`,
			"GET",
			{}
		);
	}

	async calculateDonatedMoney(Ondernemer_ondernemer_id) {
		return await this.#networkManager.doRequest(
			`${this.#route}/calculatedonatedmoney/${Ondernemer_ondernemer_id}`,
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
	 * haalt het telefoonnummer op met het bestelnummer
	 *
	 * @param {number} bestellingnummer
	 * @returns telefoonnummer van de bestelling
	 */
	async getPhonenumber(bestellingnummer) {
		return await this.#networkManager.doRequest(
			`${this.#route}/getphonenumber/${bestellingnummer}`,
			"GET"
		);
	}

	/**
	 * Update de status van een bestelling
	 *
	 * @param {number} orderId bestelnummer
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
