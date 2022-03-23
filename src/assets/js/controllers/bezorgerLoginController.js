import { Controller } from "./controller.js";

import { App } from "../app.js";

export class BezorgerLoginController extends Controller {

    #dashboardView;

    constructor()  {
        super();

        this.#setup();
    }

    async #setup() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/bezorgerLogin.html");

        //from here we can safely get elements from the view via the right getter
        const anchors = this.#dashboardView.querySelectorAll("a.nav-link");

        // //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))

    }




    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if(typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        App.loadController(controller);
        return false;
    }

}