
import { App } from "../app.js";
import { Controller } from "./controller.js";
import {BezorgerLoginRepository} from "../repositories/bezorgerLoginRepository.js";

export class BezorgerLoginController extends Controller{
    //# is a private field in Javascript
    #bezorgerLoginRepository
    #loginBezorger


    constructor() {
        super();
        this.#bezorgerLoginRepository = new BezorgerLoginRepository();
        this.#setupView()
    }


    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginBezorger = await super.loadHtmlIntoContent("html_views/bezorgerLogin.html")
        document.querySelector("#postDuifLogo").innerHTML = "PostDuif Bezorger";

        //from here we can safely get elements from the view via the right getter
        this.#loginBezorger.querySelector("#login-btn").addEventListener("click", event => this.#handleLogin(event));


        const anchors = this.#loginBezorger.querySelectorAll("a.nav-link");

        // //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))
    }

    async #handleLogin(event) {
        event.preventDefault();

        //get the input field elements from the view and retrieve the value
        const emailadres = this.#loginBezorger.querySelector("#exampleInputUsername").value;
        const wachtwoord = this.#loginBezorger.querySelector("#exampleInputPassword").value;

        try{
            const user = await this.#bezorgerLoginRepository.login(emailadres, wachtwoord);

            //let the session manager know we are logged in by setting the username, never set the password in localstorage
            App.sessionManager.set("username", user.emailadres);
            App.loadController(App.CONTROLLER_BEZORGER_BESTELLING);

            document.querySelector(".sidebar-container").style.display = "block";
        } catch(error) {
            //if unauthorized error code, show error message to the user
            if(error.code === 401) {

                alert("Password or email is not correct");
                this.#loginBezorger.querySelector(".error").innerHTML = error.reason;

            } else {
                console.error(error);
            }
        }
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