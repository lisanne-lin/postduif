/**
 * Controller for getting deliveries 
 * @author Lisanne Lin 
 */

import {OrdersRepository} from "../repositories/ordersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";


export class bezorgerBestellingController extends Controller {
    #ordersRepository
    #createBezorgerBestellingView;

    constructor() {
        super();
        this.#ordersRepository = new OrdersRepository();
        this.#setupView();
    }

   async #setupView() {
        this.#createBezorgerBestellingView = await super.loadHtmlIntoContent("html_views/bezorger_bestelling-lijst.html");
        this.#fetchOrders();
    }

    async #fetchOrders() {
        const orderData = await this.#ordersRepository.getOrders();
        console.log(orderData);

        for (let i = 0; i < 20; i++) {
            let data = orderData[i];

            let orderDetail = document.createElement('div');
            orderDetail.classList.add("order-detail")
           

            let orderDate = document.createElement('p');
            orderDate.classList.add("date");
            let company = document.createElement('p');
            company.classList.add("company-name")
            let orderNumber = document.createElement('p');
            orderNumber.classList.add("order-number")
            
            orderDetail.appendChild(orderDate);
            orderDetail.appendChild(company);
            orderDetail.appendChild(orderNumber);



            orderDate.innerHTML = data.geschatte_bezorgdatum;
            //postcode is placeholder voor bedrijfsnaam
            company.innerHTML = data.verzend_postcode;
            orderNumber.innerHTML = data.bestelnummer;
          
            document.querySelector(".order-list").appendChild(orderDetail);

        }
    
    }



}