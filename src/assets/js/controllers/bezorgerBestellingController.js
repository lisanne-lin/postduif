/**
 * Controller for getting deliveries 
 * @author Lisanne Lin 
 */

import {
    Controller
} from "./controller.js";

export class bezorgerBestellingController extends Controller {
    #createBezorgerBestellingView;

    constructor() {
        super();
        this.#setupView();
    }

    #setupView() {
        this.#createBezorgerBestellingView = super.loadHtmlIntoContent("html_views/bezorger_bestelling-lijst.html");
    }

}