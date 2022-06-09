/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js";
import { LoginController } from "./controllers/loginController.js";
import { NavbarController } from "./controllers/navbarController.js";
import { UploadController } from "./controllers/uploadController.js";
import { WelcomeController } from "./controllers/welcomeController.js";
import { DashboardController } from "./controllers/dashboardController.js";
import { PlaceOrderController } from "./controllers/placeOrderController.js";
import { RegisterController } from "./controllers/registerController.js";
import { LandingController } from "./controllers/landingController.js";
import { BezorgerLoginController } from "./controllers/bezorgerLoginController.js";
import { RegistrerenBezorgerController } from "./controllers/registrerenBezorgerController.js";
import { OrdersController } from "./controllers/OrdersController.js";
import { delivererOrderController } from "./controllers/delivererOrderController.js";
import { TrackOrderController } from "./controllers/TrackOrderController.js";
import { CustomersController } from "./controllers/CustomersController.js";
import { ClientRegisterController } from "./controllers/ClientRegisterController.js";
import { CompanyController } from "./controllers/companyController.js";
import { driverOrderDetailController } from "./controllers/driverOrderDetailController.js";
import { NavbarBusinessController } from "./controllers/NavbarBusinessController.js";
import { NavbarClientsController } from "./controllers/NavbarClientsController.js";
import { NavbarRidersController } from "./controllers/NavbarRidersController.js";
import { ReviewClientController } from "./controllers/reviewClientController.js";
import { TrackOrderWithoutLoginController } from "./controllers/TrackOrderWithoutLoginController.js";
import { clientLoginController } from "./controllers/clientLoginController.js";
import { entrepreneurSettingsController } from "./controllers/entrepreneurSettingsController.js";

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
	static CONTROLLER_REGISTREREN_BEZORGER = "registerDriver";
	static CONTROLLER_ORDERS = "orders";
	static CONTROLLER_BEZORGER_BESTELLING = "bezorgerBestelling";
	static CONTROLLER_TRACK = "trackOrder";
	static CONTROLLER_TRACK_WITHOUT_LOGIN = "trackOrderWithoutLogin";
	static CONTROLLER_CUSTOMERS = "customers";
	static CONTROLLER_CLIENT_REGISTER = "register_client";
	static CONTROLLER_ORDER_DETAIL = "driverOrderDetail";
	static CONTROLLER_NAVBAR_BUSINESS = "navbar_business";
	static CONTROLLER_NAVBAR_CLIENT = "navbar_clients";
	static CONTROLLER_NAVBAR_RIDERS = "navbar_riders";
	static CONTROLLER_COMPANY = "companies";
	static CONTROLLER_CLIENT_REVIEW = "review_clients";
	static CONTROLLER_CLIENT_LOGIN = "client_login";
	static CONTROLLER_ENTREPRENEUR_SETTINGS = "entrepreneur_settings";

	constructor() {
		//Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
		App.loadControllerFromUrl(App.CONTROLLER_LANDING);
	}

	/**
	 * Loads a controller
	 * @param name - name of controller - see static attributes for all the controller names
	 * @param controllerData - data to pass from on controller to another - default empty object
	 * @returns {boolean} - successful controller change
	 */
	static loadController(name, controllerData = {}) {
		console.log("loadController " + name);
		//log the data if data is being passed via controllers
		if (controllerData && Object.entries(controllerData).length !== 0) {
		}
		//load right controller based on the passed name to this function
		switch (name) {
			case App.CONTROLLER_NAVBAR:
				new NavbarController();
				return true;

			case App.CONTROLLER_ENTREPRENEUR_SETTINGS:
				new entrepreneurSettingsController();
				break;

			case App.CONTROLLER_NAVBAR_BUSINESS:
				new NavbarBusinessController();
				break;

			case App.CONTROLLER_NAVBAR_CLIENT:
				new NavbarClientsController();
				break;

			case App.CONTROLLER_NAVBAR_RIDERS:
				new NavbarRidersController();
				break;

			case App.CONTROLLER_CLIENT_REVIEW:
				new ReviewClientController();
				break;

			case App.CONTROLLER_CLIENT_LOGIN:
				new clientLoginController();
				App.setCurrentController(name);
				break;

			case App.CONTROLLER_LOGIN:
				App.isLoggedIn(
					() => new LoginController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_CUSTOMERS:
				App.isLoggedIn(
					() => new CustomersController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_CLIENT_REGISTER:
				App.isLoggedIn(
					() => new ClientRegisterController(),
					() => new ClientRegisterController()
				);
				break;

			case App.CONTROLLER_LOGIN_BEZORGER:
				App.isLoggedIn(
					() => new BezorgerLoginController(),
					() => new BezorgerLoginController()
				);
				break;

			case App.CONTROLLER_REGISTREREN_BEZORGER:
				App.isLoggedIn(
					() => new RegistrerenBezorgerController(),
					() => new RegistrerenBezorgerController()
				);
				break;

			case App.CONTROLLER_ORDERS:
				App.isLoggedIn(
					() => new OrdersController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_TRACK:
				App.isLoggedIn(
					() => new TrackOrderController(),
					() => new TrackOrderController()
				);
				break;

			case App.CONTROLLER_TRACK_WITHOUT_LOGIN:
				App.isLoggedIn(
					() => new TrackOrderWithoutLoginController(),
					() => new TrackOrderWithoutLoginController()
				);
				break;

			case App.CONTROLLER_DASHBOARD:
				App.isLoggedIn(
					() => new DashboardController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_LANDING:
				new LandingController();
				break;

			case App.CONTROLLER_PLACE_ORDER:
				App.isLoggedIn(
					() => new PlaceOrderController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_SIGN_UP:
				App.isLoggedIn(
					() => new RegisterController(),
					() => new RegisterController()
				);
				break;

			case App.CONTROLLER_LOGOUT:
				App.handleLogout();
				break;

			case App.CONTROLLER_WELCOME:
				App.isLoggedIn(
					() => new WelcomeController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_UPLOAD:
				App.isLoggedIn(
					() => new UploadController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_BEZORGER_BESTELLING:
				App.isLoggedIn(
					() => new delivererOrderController(),
					() => new LoginController()
				);
				break;
			case App.CONTROLLER_DRIVER:
				App.isLoggedIn(
					() => new delivererOrderController(),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_ORDER_DETAIL:
				App.isLoggedIn(
					() => new driverOrderDetailController(controllerData),
					() => new LoginController()
				);
				break;

			case App.CONTROLLER_COMPANY:
				new CompanyController();
				break;
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
			document.querySelector("nav.logged-in").style.display = "none";
		} else {
			whenNo();
			document.querySelector(".logged-in").style.display = "block";
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
window.addEventListener("DOMContentLoaded", (_) => {
	new App();
});
