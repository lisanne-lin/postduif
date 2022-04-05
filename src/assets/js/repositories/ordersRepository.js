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
                status: status})
    }

    async getOrders(){
        return await this.#networkManager.doRequest(`${this.#route}`, "GET", {});
    }

    async getOrderByOrderNum(bestelnummer) {
        return await this.#networkManager.doRequest(`${this.#route}/${bestelnummer}`, "GET");
    }

    async countOrders() {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET", {});
    }
}