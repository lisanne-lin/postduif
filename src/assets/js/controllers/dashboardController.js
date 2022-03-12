import { Controller } from "./controller.js";

export class DashboardController extends Controller {
    
    #dashboardView;
    
    constructor()  {
        super();

        this.#setup();
    }

    async #setup() {

        this.#dashboardView = await super.loadHtmlIntoContent("html_views/dashboard.html");

        const testPar = this.#dashboardView.querySelector(".test-class-p");

        console.log(testPar);
    }
}