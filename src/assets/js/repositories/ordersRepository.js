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

    async createOrder(bestelnummer,verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, verzend_datum,
                bezorgkosten, opmerking, Bezorger_bezorger_id, Klant_klantnummer, Ondernemer_ondernemer_id, besteldatum, status) {
        this.#networkManager.doRequest(this.#route, "POST",
            {bestelnummer: bestelnummer,
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
                naam:naam})
    }

    async getOrders(){
        return await this.#networkManager.doRequest(`${this.#route}/getallfor`, "GET", {});
    }

    async getOrderByOrderNum(bestelnummer) {
        return await this.#networkManager.doRequest(`${this.#route}/getorder/${bestelnummer}`, "GET");
    }

    async getOrderByOrderNumAndZip(bestelnummer, zip) {
        return await this.#networkManager.doRequest(`${this.#route}/trackorder/${bestelnummer}/${zip}`, "GET");
    }

    async countOrders(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/count/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async deleteOrders(bestelnummer){
        return await this.#networkManager.doRequest(`${this.#route}/delete/${bestelnummer}`, "POST", {});
    }

    async countOrdersOmw(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/countomw/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async countOrdersHere(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/counthere/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async calculateEarningsToday(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/calculateearningstoday/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async calculateEarningsWeek(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/calculateearningsweek/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async calculateEarningsMonth(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/calculateearningsmonth/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async calculateDonatedMoney(Ondernemer_ondernemer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/calculatedonatedmoney/${Ondernemer_ondernemer_id}`, "GET", {});
    }

    async getCompanyName(naam) {
        return await this.#networkManager.doRequest(`${this.#route}/getcompanyname/${naam}`, "GET");
    }
}