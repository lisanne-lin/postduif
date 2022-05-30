import {App} from "../app.js";
import {Controller} from "./controller.js";
import {ReviewRepsitory} from "../repositories/reviewRepsitory.js";

export class ReviewClientController extends Controller {
    #reviewClient
    #reviewRepsitory;

    constructor() {
        super();
        this.#reviewRepsitory = new ReviewRepsitory();
        this.#setupView()

    }


    async #setupView() {

        App.loadController(App.CONTROLLER_NAVBAR_RIDERS);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#reviewClient = await super.loadHtmlIntoContent("html_views/review_clients.html")
        document.querySelector("#postDuifLogo").innerHTML = "PostDuif Bezorger";

        const anchors = this.#reviewClient.querySelectorAll("a.nav-link");

        this.#reviewClient.querySelector("#buttonSend").addEventListener("click",
            (event) => this.#commend(event));

        // //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))

        this.#reviewClient.querySelector("#error").hidden = true;
        this.#reviewClient.querySelector("#success").hidden = true;
    }


    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if (typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        App.loadController(controller);
        return false;
    }


    #commend(event) {
        event.preventDefault();



        //todo add user id
        const customer_id = 1;

        //todo add company id
        const entrepreneur_id = 2;
        const command = this.#reviewClient.querySelector("#reviewBox").value;

        //todo add rating menu
        const rating = 5;




        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


        if (command === ''){

            const error = this.#reviewClient.querySelector("#error").hidden = false;
        }else {

            //code for db

            const error = this.#reviewClient.querySelector("#error").hidden = true;
            const success = this.#reviewClient.querySelector("#success").hidden = false;


            this.#reviewRepsitory.createReview(null, customer_id, entrepreneur_id, command, rating, date);
        }
    }
}
