import { Controller } from "./controller.js";

export class RegistrerenBezorgerController extends Controller {

    #dashboardView;

    constructor()  {
        super();

        this.#setup();
    }

    async #setup() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/registrerenBezorger.html");

        // from here we can safely get elements from the view via the right getter
        // const anchors = this.#navbarView.querySelectorAll("a.nav-link");

        //set click listener on each anchor
        // anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))


        console.log( this.#dashboardView );
    }
}