import {NetworkManager} from "../framework/utils/networkManager.js";

export class CustomersRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/klant";
        this.#networkManager = new NetworkManager();
    }

    async login(emailadres, wachtwoord){
        return await this.#networkManager.doRequest(`${this.#route}/login`, "POST", {"emailadres": emailadres, "wachtwoord": wachtwoord});
    }

    async getCustomers(entrepreneurNum){
        return await this.#networkManager.doRequest(`${this.#route}/getallfor/${entrepreneurNum}`, "GET", {});
    }

    async getUserIdByEmail(emailadres){
        return await this.#networkManager.doRequest(`${this.#route}/getIdFromEmailAdres/${emailadres}`, "GET", {});
    }

    async getCustomerByEmail(emailadres){
        return await this.#networkManager.doRequest(`${this.#route}/getcustomer/${emailadres}`, "GET", {});
    }

    async createCustomer(klantnummer, voornaam, achternaam, emailadres, telefoonnummer, plaats, adres, postcode, wachtwoord) {
        this.#networkManager.doRequest(`${this.#route}/createcustomer`, "POST",
            {
                klantnummer: klantnummer,
                voornaam: voornaam,
                achternaam: achternaam,
                emailadres: emailadres,
                telefoonnummer: telefoonnummer,
                plaats: plaats,
                adres: adres,
                postcode: postcode,
                wachtwoord: wachtwoord
            })
    }

    async getCustomerById (klantnummer) {
        return await this.#networkManager.doRequest(`${this.#route}/getcustomerbyid/${klantnummer}`, "GET", {});
    }

    async getOrdersFromCustomer(klantnummer) {
        return await this.#networkManager.doRequest(`${this.#route}/getordersfromcustomer/${klantnummer}`, "GET", {});
    }
}