import {App} from "../app.js";
import {Controller} from "./controller.js";
import {EntrepreneursRepository} from "../repositories/entrepreneursRepository.js";

export class entrepreneurSettingsController extends Controller{
    #entrepreneursRepository
    #entrepreneurSettingsView

    constructor() {
        super();
        this.#entrepreneursRepository = new EntrepreneursRepository();
        this.#setupView();
    }

    async #setupView() {
        App.loadController(App.CONTROLLER_NAVBAR_BUSINESS);
        this.#entrepreneurSettingsView = await super.loadHtmlIntoContent("html_views/entrepreneur_settings.html")
    }
}