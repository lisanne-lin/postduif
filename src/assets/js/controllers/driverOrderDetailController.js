/**
 * Controller for getting deliveries 
 * @author Lisanne Lin 
 */

 import {OrdersRepository} from "../repositories/ordersRepository.js";
 import {App} from "../app.js";
 import {Controller} from "./controller.js";
 
 
 export class driverOrderDetailController extends Controller {
     #ordersRepository
     #driverOrderDetailController;
 
     constructor() {
         super();
         this.#ordersRepository = new OrdersRepository();
         this.#setupView();
     }
 
    async #setupView() {
         this.#driverOrderDetailController = await super.loadHtmlIntoContent("html_views/order-page-details_deliverer.html");
         this.#fetchOrders();
     }
 
     async #fetchOrders() {
         const orderData = await this.#ordersRepository.getOrders();
         const getCompanyName = await this.#ordersRepository.getCompanyName();
;
 

         let data = orderData;
         let name = document.querySelector(".company-name").innerHTML = getCompanyName;
        
         console.log(name);

        const deliverButton =  document.getElementById("deliverOrder");
        const pickupButton  = document.getElementById("pickOrder");
        
        deliverButton.style.display = "none";
        
        pickupButton.onclick = function() {
            deliverButton.style.display = "block";
            pickupButton.style.display = "none";
            console.log("click")

        }
     }
   
            //  let data = orderData[i];
            //  let name = getCompanyName[i];
            //  let orderDetail = document.createElement('div');
            //  orderDetail.classList.add("order-detail")
            
 
            //  let orderDate = document.createElement('p');
            //  orderDate.classList.add("date");
            //  let company = document.createElement('p');
            //  company.classList.add("company-name")
            //  let orderNumber = document.createElement('p');
            //  orderNumber.classList.add("order-number")
             
            //  orderDetail.appendChild(orderDate);
            //  orderDetail.appendChild(company);
            //  orderDetail.appendChild(orderNumber);
 
 
 
            //  orderDate.innerHTML = data.geschatte_bezorgdatum;
            //  company.innerHTML = name.naam;
            //  orderNumber.innerHTML = data.bestelnummer;
 
            //  document.querySelector(".order-list").appendChild(orderDetail);

 
 }

  
