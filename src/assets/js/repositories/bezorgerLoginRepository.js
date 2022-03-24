/**
 * Repository for loginBezorger
 *
 *
 * @author Joy Park
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class BezorgerLoginRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/bezorger"
        this.#networkManager = new NetworkManager();
    }

    async login(emailadres, wachtwoord) {
        return await this.#networkManager
            .doRequest(`${this.#route}/login`, "POST", {"emailadres": emailadres, "wachtwoord": wachtwoord});
    }



}