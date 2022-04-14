/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {
    SessionManager
} from "./framework/utils/sessionManager.js"
import {
    LoginController
} from "./controllers/loginController.js"
import {
    NavbarController
} from "./controllers/navbarController.js"
import {
    UploadController
} from "./controllers/uploadController.js"
import {
    WelcomeController
} from "./controllers/welcomeController.js"
import {
    DashboardController
} from "./controllers/dashboardController.js"
import {
    PlaceOrderController
} from "./controllers/placeOrderController.js";
import {
    RegisterController
} from "./controllers/registerController.js";
import {
    LandingController
} from "./controllers/landingController.js";
import {
    BezorgerLoginController
} from "./controllers/bezorgerLoginController.js";
import {
    RegistrerenBezorgerController
} from "./controllers/registrerenBezorgerController.js";
import {
    OrdersController
} from "./controllers/OrdersController.js";
import {
    bezorgerBestellingController
} from "./controllers/bezorgerBestellingController.js";
import {TrackOrderController} from "./controllers/TrackOrderController.js";
import {CustomersController} from "./controllers/CustomersController.js";


export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_LOGIN_BEZORGER = "loginBezorger";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_WELCOME = "welcome";
    static CONTROLLER_UPLOAD = "upload";
    static CONTROLLER_DASHBOARD = "dashboard";
    static CONTROLLER_PLACE_ORDER = "place_order";
    static CONTROLLER_SIGN_UP = "sign_up";
    static CONTROLLER_LANDING = "landing";
    static CONTROLLER_REGISTREREN_BEZORGER = "registrerenBezorger";
    static CONTROLLER_ORDERS = "orders";
    static CONTROLLER_BEZORGER_BESTELLING = "bezorgerBestelling"
    static CONTROLLER_TRACK = "trackOrder"
    static CONTROLLER_CUSTOMERS = "customers"


    constructor() {
        //Always load the navigation
        App.loadController(App.CONTROLLER_NAVBAR);

        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        App.loadControllerFromUrl(App.CONTROLLER_LANDING);

        // App.loadControllerFromUrl(App.CONTROLLER_DASHBOARD);
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData = {}) {
        console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            console.log(controllerData);
        }

        //load right controller based on the passed name to this function
        switch (name) {
            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                break;

            case App.CONTROLLER_LOGIN:
                App.setCurrentController(name);
                App.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case App.CONTROLLER_CUSTOMERS:
                App.setCurrentController(name);
                App.isLoggedIn(() => new CustomersController(), () => new LoginController());
                break;

            case App.CONTROLLER_LOGIN_BEZORGER:
                App.setCurrentController(name);
                App.isLoggedIn(() => new BezorgerLoginController(), () => new BezorgerLoginController());
                break;
            case App.CONTROLLER_REGISTREREN_BEZORGER:
                App.setCurrentController(name);
                App.isLoggedIn(() => new RegistrerenBezorgerController(), () => new RegistrerenBezorgerController());
                break;

            case App.CONTROLLER_ORDERS:
                App.setCurrentController(name);
                App.isLoggedIn(() => new OrdersController(), () => new LoginController());
                break;

            case App.CONTROLLER_TRACK:
                App.setCurrentController(name);
                App.isLoggedIn(() => new TrackOrderController(), () => new TrackOrderController());
                break;


            case App.CONTROLLER_DASHBOARD:
                App.setCurrentController(name);
                App.isLoggedIn(() => new DashboardController(), () => new LoginController());
                break;

            case App.CONTROLLER_LANDING:
                App.setCurrentController(name);
                new LandingController();
                break;

            case App.CONTROLLER_PLACE_ORDER:
                App.setCurrentController(name);
                App.isLoggedIn(() => new PlaceOrderController(), () => new LoginController());
                break;

            case App.CONTROLLER_SIGN_UP:
                App.setCurrentController(name);
                App.isLoggedIn(() => new RegisterController(), () => new RegisterController());
                break;

            case App.CONTROLLER_LOGOUT:
                App.setCurrentController(name);
                App.handleLogout();
                break;

            case App.CONTROLLER_WELCOME:
                App.setCurrentController(name);
                App.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case App.CONTROLLER_UPLOAD:
                App.isLoggedIn(() => new UploadController(), () => new LoginController());
                break;

            case App.CONTROLLER_BEZORGER_BESTELLING:
                App.isLoggedIn(() => new bezorgerBestellingController(), () => new LoginController());
                break

            default:
                return false;
        }

        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController)) {
                App.loadController(fallbackController);
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        return location.hash.slice(1);
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     */
    static setCurrentController(name) {
        location.hash = name;
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("username")) {
            whenYes();
            // document.querySelector(".navbar").style.display = "none";
        } else {
            whenNo();
            // document.querySelector(".navbar").style.display = "block";
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.remove("username");

        //go to login screen
        App.loadController(App.CONTROLLER_LANDING);
    }
}

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});