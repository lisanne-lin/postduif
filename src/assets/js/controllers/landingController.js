import { Controller } from "./controller.js";
import {App} from "../app.js";

export class LandingController extends Controller {

    #landingView;

    constructor()  {
        super();
        this.#setup();
    }

    async #setup() {
        this.#landingView = await super.loadHtmlIntoContent("html_views/landing.html");

        // document.querySelector(".navbar").style.display = "none";

        const anchors = this.#landingView.querySelectorAll("a.business-login");

        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)));

        this.#landingView.querySelector("#sign-up-btn").addEventListener("click", event => {
            App.loadController(App.CONTROLLER_SIGN_UP);
        })
        this.#landingView.querySelector("#log-in-btn").addEventListener("click", event => {
            App.loadController(App.CONTROLLER_LOGIN);
        })
        
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
