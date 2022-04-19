import {App} from "../app.js";
import {Controller} from "./controller.js";
import {CustomersRepository} from "../repositories/customersRepository.js";

export class CustomersController extends Controller {

    #customersRepository
    #customersView;

    constructor() {
        super();
        this.#customersRepository = new CustomersRepository();
        this.#setup();
    }

    async #setup() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);

        this.#customersView = await super.loadHtmlIntoContent("html_views/customers.html")
        document.querySelector(".navbar").style.display = "block";

        this.#customersView.querySelector("#search-btn").addEventListener("click", event => {
            this.#fetchCustomerByEmail(this.#customersView.querySelector("#tracktrace").value);
        })

        this.#customersView.querySelector("#sendmail").addEventListener("click", event => {

        })

        this.#customersView.querySelector("#dismiss-btn").addEventListener("click", event => {
            App.loadController(App.CONTROLLER_CUSTOMERS);
        })

        this.#fetchCustomers()
    }

    async #fetchCustomers() {
        const customerData = await this.#customersRepository.getCustomers(1);

        for (let i = 0; i < customerData.length; i++) {
            let data = customerData[i];
            const table = this.#customersView.querySelector("#order-table");
            let tableRow = table.insertRow()
            let imageCell = tableRow.insertCell()
            let nameCell = tableRow.insertCell()
            let emailCell = tableRow.insertCell()
            let numberCell = tableRow.insertCell()
            let locationCell = tableRow.insertCell()
            let contactCell = tableRow.insertCell()

            let img = document.createElement("img")

            let num = Math.floor(Math.random()*(8-1+1)+1)

            img.src = `assets/img/avatar${num}.svg`;
            img.height = 33;

            imageCell.append(img);
            nameCell.append(data.voornaam + " " + data.achternaam);
            emailCell.append(data.emailadres);
            numberCell.append(data.telefoonnummer);
            locationCell.append(data.plaats);
            contactCell.append(data.geschatte_bezorgdatum);

            table.append(tableRow);
        }

    }


    async #fetchCustomerByEmail(email) {
        try {
            const data = await this.#customersRepository.getCustomerByEmail(email);
            if (data == null) {
                throw new Error()
            } else {
                let nameClient = this.#customersView.querySelector("#nameclient");
                let emailClient = this.#customersView.querySelector("#emailclient");
                let locationClient = this.#customersView.querySelector("#locationclient");
                let phoneClient = this.#customersView.querySelector("#phoneclient");
                let imageClient = this.#customersView.querySelector("#imageclient");
                let emailInputClient = this.#customersView.querySelector("#recipient-name")
                let num = Math.floor(Math.random()*(8-1+1)+1)

                nameClient.innerHTML = data[0].voornaam + " " + data[0].achternaam;
                emailClient.innerHTML = data[0].emailadres
                emailInputClient.value = data[0].emailadres
                locationClient.innerHTML = data[0].plaats
                phoneClient.innerHTML =  data[0].telefoonnummer
                imageClient.src = `assets/img/avatar${num}.svg`;

                this.#customersView.querySelector("#contact-found").style.display = "block";
                this.#customersView.querySelector("#save-btn").style.display = "block";
            }

        } catch (e) {
            this.#customersView.querySelector("#save-btn").style.display = "none";
        }
    }

}