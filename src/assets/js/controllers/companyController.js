/**
 * Controller for getting deliveries
 * @author Lisanne Lin
 */

import {CompanyRepository} from "../repositories/companyRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";


export class CompanyController extends Controller {
    #companyController;
    #companyRepository;

    constructor() {
        super();
        this.#setupView();
        this.#companyRepository = new CompanyRepository();
    }

    async #setupView() {
        this.#companyController = await super.loadHtmlIntoContent("html_views/companies.html");



        this.#getreviewsList();
    }

    async #getreviewsList() {


        let abouts = await this.#companyRepository.getAbout();
        console.log(abouts);


        //add html

        for (let i = 0; i < abouts.length; i++) {

            let template = document.getElementById("abouts").innerHTML += ' <div  id="box"><a href="#' + abouts[i].ondernemer_id + '"  class="list-group-item list-group-item-action flex-column align-items-start business-login">\n' +
                '            <div class="d-flex w-100 justify-content-between">\n' +
                '                <h5 class="mb-1">' + abouts[i].naam + '</h5>\n' +
                '                <small class="text-muted">' + abouts[i].telefoonnummer + '</small>\n' +
                '            </div>\n' +
                '            <p class="mb-1">Adres '+ abouts[i].adres  + '<br> ' + abouts[i].postcode  + '<br> ' + abouts[i].plaats +' \</p>\n' +
                '            <small class="text-muted">' + abouts[i].eigenaar + '</small><br><br> <button id="boxing"  data-controller="review_clients" type="button" class="btn btn-secondary btn-sm">More info</button> \n' +

                '        </a></div>\n';

        }
        // const anchors = this.#companyController.querySelectorAll("a.business-login");
        const anchors = this.#companyController.querySelectorAll("#boxing");


        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)));


    }




    #handleClickNavigationItem(event) {


        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if(typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        //TODO: You should add highlighting of correct anchor when page is active :)

        //Pass the action to a new function for further processing

        App.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }
}

  
