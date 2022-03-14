/**
 * Repository voor Entity Entrepreneurs
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class EntrepreneursRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/ondernemer";
        this.#networkManager = new NetworkManager();
    }

    createEntrepreneur(ondernemer_id, naam, eigenaar, adres, plaats, postcode, telefoonnummer, emailadres, wachtwoord) {
        this.#networkManager.doRequest(this.#route, "POST",
            {
                ondernemer_id: ondernemer_id,
                naam: naam,
                eigenaar: eigenaar,
                adres: adres,
                plaats: plaats,
                postcode: postcode,
                telefoonnummer: telefoonnummer,
                emailadres: emailadres,
                wachtwoord: wachtwoord
            })
    }
}