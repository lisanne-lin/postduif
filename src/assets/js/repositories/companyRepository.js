/**
 * Repository voor company
 * @author Joy Park
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class CompanyRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/about";
        this.#networkManager = new NetworkManager();
    }

    async getAbout() {
        return await this.#networkManager.doRequest(`${this.#route}/abouts/`, "GET", {});
    }




}