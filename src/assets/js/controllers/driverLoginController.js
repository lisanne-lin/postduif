/**
 * Controller driver login
 * @author Joy Park
 */
import { App } from "../app.js";
import { Controller } from "./controller.js";
import {DriverLoginRepository} from "../repositories/driverLoginRepository.js";

export class driverLoginController extends Controller{
    //# is a private field in Javascript
    #driverLoginRepository
    #loginDriver


    constructor() {
        super();
        this.#driverLoginRepository = new DriverLoginRepository();
        this.#setupView()
    }


    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_RIDERS);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginDriver = await super.loadHtmlIntoContent("html_views/driverLogin.html")
        document.querySelector("#postDuifLogo").innerHTML = "PostDuif Bezorger";

        this.#loginDriver.querySelector("#login-btn").addEventListener("click", event => this.#handleLogin(event));


        const anchors = this.#loginDriver.querySelectorAll("a.nav-link");

        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))
    }

    async #handleLogin(event) {
        event.preventDefault();

        const email_address = this.#loginDriver.querySelector("#exampleInputUsername").value;
        const password = this.#loginDriver.querySelector("#exampleInputPassword").value;

        try{
            const user = await this.#driverLoginRepository.login(email_address, password);

            //let the session manager know we are logged in by setting the username, never set the password in localstorage
            App.sessionManager.set("username", user.email_address);
            App.loadController(App.CONTROLLER_BEZORGER_BESTELLING);

            document.querySelector(".sidebar-container").style.display = "block";
        } catch(error) {
            //if unauthorized error code, show error message to the user
            if(error.code === 401) {

                alert("Password or email is not correct");
                this.#loginDriver.querySelector(".error").innerHTML = error.reason;

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