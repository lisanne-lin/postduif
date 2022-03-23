/**
 * Repository voor bezorger
 * @author Joy Park
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class BezorgerRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/bezorger";
        this.#networkManager = new NetworkManager();
    }

    createBezorger(bezorger_id, firstName, surName, datum, adres, plaats, postcode, email, telefoonnummer, wachtwoord) {
        this.#networkManager.doRequest(this.#route, "POST",
            {
                bezorger_id: bezorger_id,
                firstNameBezorger: firstName,
                surNameBezorger: surName,
                datumBezorger: datum,
                adresBezorger: adres,
                plaatsBezorger: plaats,
                postcodeBezorger: postcode,
                emailBezorger: email,
                telefoonnummerBezorger: telefoonnummer,
                wachtwoordBezorger: wachtwoord
            })
    }
}