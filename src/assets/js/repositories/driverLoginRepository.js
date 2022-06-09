/**
 * Repository for loginBezorger
 *
 * @author Joy Park
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class DriverLoginRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/driver"
        this.#networkManager = new NetworkManager();
    }

    async login(email_address, password) {
        return await this.#networkManager
            .doRequest(`${this.#route}/login`, "POST", {"emailadres": email_address, "password": password});
    }



}