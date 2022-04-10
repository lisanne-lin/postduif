import { Controller } from "./controller.js";
import {App} from "../app.js";

export class TrackOrderController extends Controller {

    #trackView;

    constructor()  {
        super();
        this.#setup();
    }

    async #setup() {
        this.#trackView = await super.loadHtmlIntoContent("html_views/track_order.html");
    }
}
