import {NetworkManager} from "../framework/utils/networkManager.js";

export class CustomersRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/klant";
        this.#networkManager = new NetworkManager();
    }


    async getCustomers(entrepreneurNum){
        return await this.#networkManager.doRequest(`${this.#route}/getallfor/${entrepreneurNum}`, "GET", {});
    }


    async getCustomerByEmail(emailadres){
        return await this.#networkManager.doRequest(`${this.#route}/getcustomer/${emailadres}`, "GET", {});
    }


}