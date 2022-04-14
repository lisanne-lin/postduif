import {NetworkManager} from "../framework/utils/networkManager.js";

export class CustomersRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/klant";
        this.#networkManager = new NetworkManager();
    }
}