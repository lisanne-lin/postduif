/**
 * Controller responsible for all events in login view
 * @author Pim Meijer
 */

import {UsersRepository} from "../repositories/usersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {CustomersRepository} from "../repositories/customersRepository.js";

export class clientLoginController extends Controller{
    //# is a private field in Javascript
    #usersRepository
    #customersRepository
    #loginView

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#customersRepository = new CustomersRepository();

        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_CLIENT);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginView = await super.loadHtmlIntoContent("html_views/client_login.html")

        //from here we can safely get elements from the view via the right getter
        this.#loginView.querySelector("#login-btn").addEventListener("click", event => this.#handleLogin(event));

    }
    /**
     * Async function that does a login request via repository
     * @param event
     */
    async #handleLogin(event) {
        //prevent actual submit and page refresh
        event.preventDefault();

        //get the input field elements from the view and retrieve the value
        const emailadres = this.#loginView.querySelector("#exampleInputUsername").value;
        const wachtwoord = this.#loginView.querySelector("#exampleInputPassword").value;

        try{
            const user = await this.#customersRepository.login(emailadres, wachtwoord);

            //let the session manager know we are logged in by setting the username, never set the password in localstorage
            App.sessionManager.set("username", user.emailadres);
            App.loadController(App.CONTROLLER_TRACK);
        } catch(error) {
            //if unauthorized error code, show error message to the user
            if(error.code === 401) {
                this.#loginView.querySelector(".error").innerHTML = error.reason
            } else {
                console.error(error);
            }
        }
    }
}