import {App} from "../app.js";
import {Controller} from "./controller.js";
import {ReviewRepsitory} from "../repositories/reviewRepsitory.js";

export class ReviewClientController extends Controller {
    #reviewClient
    #reviewRepsitory;

    constructor() {
        super();
        this.#setupView();
        this.#reviewRepsitory = new ReviewRepsitory();
    }

    async #setupView() {

        App.loadController(App.CONTROLLER_NAVBAR_CLIENT);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#reviewClient = await super.loadHtmlIntoContent("html_views/review_clients.html")
        const anchors = this.#reviewClient.querySelectorAll("a.nav-link");


        //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))


        let parts = window.location.href.split('#');


        let compId = parts.pop() || parts.pop();

        this.#reviewClient.querySelector("#error").hidden = true;
        this.#reviewClient.querySelector("#success").hidden = true;

        await this.#getreviewsList(compId);
        await this.#getOndernemerInfo(compId);

        this.#reviewClient.querySelector("#buttonSend").addEventListener("click",
            (event) => this.#commend(compId));


    }

    async #getreviewsList(compId) {
        let counterBad = 0;
        let counterGood = 0;
        let counterNotSoGood = 0;


        let reviews = await this.#reviewRepsitory.getReviewsById(compId);


        if (reviews.length !== 0) {
            for (let i = 0; i < reviews.length; i++) {


                let template = document.getElementById("reviewBoxList").innerHTML += '   <div class="row">\n' +
                    '                            <div>\n' +
                    '                            </div>\n' +
                    '                            <div class="col-sm-9">\n' +
                    '                                <div class="review-block-rate">\n' +
                    '                                <div class="review-block-title" style="font-size: 25px;">Score: ' + reviews[i].beoordeling + '/5</div>\n' +
                    '                                </div>\n' +
                    '                                <div class="review-block-description" id="text"> ' + reviews[i].tekst + '</div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <hr/>';


                if (reviews[i].beoordeling === 1 || reviews[i].beoordeling === 2) {
                    counterBad++;
                }
                if (reviews[i].beoordeling === 3) {
                    counterNotSoGood++;
                }
                if (reviews[i].beoordeling === 4 || reviews[i].beoordeling === 5) {
                    counterGood++;
                }

            }
        } else {
            let text = document.createElement("p");

            text.innerHTML = "It looks like you don't have any reviews yet..."

            document.getElementById("reviewBoxList").appendChild(text);
        }


        document.getElementById("reviewCount").innerText = reviews.length + " Reviews";


        //reviews
        document.getElementById("badReviews").innerText = counterBad + " Reviews";
        document.getElementById("positiveReview").innerText = counterGood + " Reviews";
        document.getElementById("neutralReview").innerText = counterNotSoGood + " Reviews";


        let counterGoodTotal = counterGood / reviews.length * 100;
        let counterNotSoGoodTotal = counterNotSoGood / reviews.length * 100;
        let counterBadTotal = counterBad / reviews.length * 100;

        document.getElementById("progressGood").style.width = counterGoodTotal + "%";
        document.getElementById("progressNeutral").style.width = counterNotSoGoodTotal + "%";
        document.getElementById("progressBad").style.width = counterBadTotal + "%";


    }

    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if (typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        App.loadController(controller);
        return false;
    }


    #commend(compId) {

        //todo add sessionID
        const customer_id = 1;


        const entrepreneur_id = compId;
        const command = this.#reviewClient.querySelector("#reviewBox").value;

        const ratings = document.getElementById('select');
        const rating = ratings.value;


        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        //check if something is filled in the review box
        if (command === '') {

            const error = this.#reviewClient.querySelector("#error").hidden = false;
        } else {

            //code for db

            const error = this.#reviewClient.querySelector("#error").hidden = true;
            const success = this.#reviewClient.querySelector("#success").hidden = false;


            this.#reviewRepsitory.createReview(null, customer_id, entrepreneur_id, command, rating, date);


            // App.loadController('review_clients');
            // return false;
        }
    }

    async #getOndernemerInfo(compId) {
        let ondernemerInfo = await this.#reviewRepsitory.getOndernemerInfoByID(compId);

        document.getElementById("companyName").innerText = ondernemerInfo[0].naam;
        document.getElementById("address").innerText = ondernemerInfo[0].adres + "\n" + ondernemerInfo[0].postcode + " " + ondernemerInfo[0].plaats;
        document.getElementById("telephone").innerText = ondernemerInfo[0].telefoonnummer;
        console.log(ondernemerInfo)
        console.log(ondernemerInfo[0].naam)
    }
}