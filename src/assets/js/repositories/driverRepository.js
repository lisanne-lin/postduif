/**
 * Repository voor bezorger
 * @author Joy Park
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class DriverRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/driver";
        this.#networkManager = new NetworkManager();
    }


    async createBezorger(deliverer_id, firstName, surName, address, place, zip, email, phonenumber, password) {
        this.#networkManager.doRequest(this.#route, "POST",
            {
                deliverer_id: deliverer_id,
                firstNameDriver: firstName,
                surNameDriver: surName,
                addressDriver: address,
                placeDriver: place,
                zipDriver: zip,
                emailDriver: email,
                phonenumberDriver: phonenumber,
                passwordDriver: password
            })
    }



}