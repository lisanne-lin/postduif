/**
 * Repository voor bezorger
 * @author Joy Park
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class ReviewRepsitory {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/review";
        this.#networkManager = new NetworkManager();
    }


    async createReview(review_id, customerId, entrepreneurId, command, rating, date) {
        this.#networkManager.doRequest(this.#route, "POST",
            {
                review_id: review_id,
                customer_id: customerId,
                entrepreneur_id: entrepreneurId,
                command: command,
                rating: rating,
                review_date: date
            })
    }



}