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

        document.querySelector(".navbar").style.display = "none";
        
        this.#landingView.querySelector("#login-btn").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })
        this.#landingView.querySelector("#signup-btn").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })
        this.#landingView.querySelector("#signup-btn2").addEventListener("click", event => {
            App.loadController(event.target.dataset.controller);
        })
    }
}