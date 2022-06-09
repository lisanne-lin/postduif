/**
 * Repository voor Entity Entrepreneurs
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class EntrepreneursRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/entrepreneur";
        this.#networkManager = new NetworkManager();
    }

    async getUserIdByEmail(emailaddress) {
        return await this.#networkManager.doRequest(`${this.#route}/getIdFromemailaddress/${emailaddress}`, "GET");
    }

    async createEntrepreneur(entrepreneur_id, name, owner, address, place, zip, phonenumber, emailaddress, password) {
        this.#networkManager.doRequest(this.#route, "POST",
            {
                entrepreneur_id: entrepreneur_id,
                name: name,
                owner: owner,
                address: address,
                place: place,
                zip: zip,
                phonenumber: phonenumber,
                emailaddress: emailaddress,
                password: password
            })
    }

    async getEntrepreneurById(entrepreneur_id) {
        return await this.#networkManager.doRequest(`${this.#route}/getentrepreneur/${entrepreneur_id}`, "GET");
    }


}