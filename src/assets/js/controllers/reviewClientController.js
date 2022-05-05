import { App } from "../app.js";
import { Controller } from "./controller.js";

export class ReviewClientController extends Controller{
    #reviewClient

    constructor() {
        super();
        this.#setupView()
    }


    async #setupView() {

        console.log("hey ithis ");
        App.loadController(App.CONTROLLER_NAVBAR_RIDERS);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#reviewClient = await super.loadHtmlIntoContent("html_views/review_clients.html")
        document.querySelector("#postDuifLogo").innerHTML = "PostDuif Bezorger";

        const anchors = this.#reviewClient.querySelectorAll("a.nav-link");

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
