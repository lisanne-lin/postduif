import {NetworkManager} from "../framework/utils/networkManager.js";

export class CustomersRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/customer";
        this.#networkManager = new NetworkManager();
    }

    async login(emailaddress, password){
        return await this.#networkManager.doRequest(`${this.#route}/login`, "POST", {"emailaddress": emailaddress, "password": password});
    }

    async getCustomers(entrepreneurNum){
        return await this.#networkManager.doRequest(`${this.#route}/getallfor/${entrepreneurNum}`, "GET", {});
    }

    async getUserIdByEmail(emailaddress){
        return await this.#networkManager.doRequest(`${this.#route}/getIdFromemailaddress/${emailaddress}`, "GET", {});
    }

    async getCustomerByEmail(emailaddress){
        return await this.#networkManager.doRequest(`${this.#route}/getcustomer/${emailaddress}`, "GET", {});
    }

    async createCustomer(customer_id, first_name, last_name, emailaddress, phonenumber, place, address, zip, password) {
        this.#networkManager.doRequest(`${this.#route}/createcustomer`, "POST",
            {
                customer_id: customer_id,
                first_name: first_name,
                last_name: last_name,
                emailaddress: emailaddress,
                phonenumber: phonenumber,
                place: place,
                address: address,
                zip: zip,
                password: password
            })
    }

    async getCustomerById (customer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/getcustomerbyid/${customer_id}`, "GET", {});
    }

    async getOrdersFromCustomer(customer_id) {
        return await this.#networkManager.doRequest(`${this.#route}/getordersfromcustomer/${customer_id}`, "GET", {});
    }
}