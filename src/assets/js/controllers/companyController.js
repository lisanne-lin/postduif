/**
 * Controller for getting deliveries 
 * @author Lisanne Lin 
 */

 import {OrdersRepository} from "../repositories/ordersRepository.js";
 import {App} from "../app.js";
 import {Controller} from "./controller.js";
 
 
 export class CompanyController extends Controller {
     #companyController;
 
     constructor() {
         super();
         this.#setupView();
     }
 
    async #setupView() {
         this.#companyController = await super.loadHtmlIntoContent("html_views/companies.html");
     }
 

 
 }

  
