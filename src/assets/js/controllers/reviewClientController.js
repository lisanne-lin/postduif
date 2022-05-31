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

        App.loadController(App.CONTROLLER_NAVBAR_RIDERS);
        //await for when HTML is loaded, never skip this method call in a controller
        this.#reviewClient = await super.loadHtmlIntoContent("html_views/review_clients.html")
        document.querySelector("#postDuifLogo").innerHTML = "PostDuif Bezorger";

        const anchors = this.#reviewClient.querySelectorAll("a.nav-link");

        this.#reviewClient.querySelector("#buttonSend").addEventListener("click",
            (event) => this.#commend(event));

        // //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)))



        this.#reviewClient.querySelector("#error").hidden = true;
        this.#reviewClient.querySelector("#success").hidden = true;


        await this.#getreviewsList()
    }



    async #getreviewsList() {
        let userid = 2;
        let counterBad = 0;
        let counterGood = 0;
        let counterNotSoGood = 0;

        let reviews = await this.#reviewRepsitory.getReviewsById(userid);


        if (reviews.length !== 0) {
            for (let i = 0; i < reviews.length; i++) {



                let template = document.getElementById("reviewBoxList").innerHTML += '   <div class="row">\n' +
                    '                            <div class="col-sm-3">\n' +
                    '                                <img src="http://dummyimage.com/60x60/666/ffffff&text=No+Image" class="img-rounded">\n' +
                    '                                <div class="review-block-name"><a href="#">'+reviews[i].achternaam +'</a></div>\n' +
                    '                                <div class="review-block-date">2022-05-31<br/>1 day ago</div>\n' +
                    '                            </div>\n' +
                    '                            <div class="col-sm-9">\n' +
                    '                                <div class="review-block-rate">\n' +
                    '                                    <button type="button" class="btn btn-warning btn-xs" aria-label="Left Align">\n' +
                    '                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>\n' +
                    '                                    </button>\n' +
                    '                                    <button type="button" class="btn btn-warning btn-xs" aria-label="Left Align">\n' +
                    '                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>\n' +
                    '                                    </button>\n' +
                    '                                    <button type="button" class="btn btn-warning btn-xs" aria-label="Left Align">\n' +
                    '                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>\n' +
                    '                                    </button>\n' +
                    '                                    <button type="button" class="btn btn-default btn-grey btn-xs"\n' +
                    '                                            aria-label="Left Align">\n' +
                    '                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>\n' +
                    '                                    </button>\n' +
                    '                                    <button type="button" class="btn btn-default btn-grey btn-xs"\n' +
                    '                                            aria-label="Left Align">\n' +
                    '                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>\n' +
                    '                                    </button>\n' +
                    '                                </div>\n' +
                    '                                <div class="review-block-title">this was nice in buy</div>\n' +
                    '                                <div class="review-block-description" id="text"> '+reviews[i].tekst +'</div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <hr/>';


                //todo maak review block


                if(reviews[i].beoordeling === 1 || reviews[i].beoordeling === 2){
                    counterBad++;
                }
                if(reviews[i].beoordeling === 3 ){
                    counterNotSoGood++;
                }
                if(reviews[i].beoordeling === 4 || reviews[i].beoordeling ===  5 ){
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


    #commend(event) {
        event.preventDefault();



        //todo add user id
        const customer_id = 1;

        //todo add company id
        const entrepreneur_id = 2;
        const command = this.#reviewClient.querySelector("#reviewBox").value;

        //todo add rating menu
        const rating = 5;




        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


        if (command === ''){

            const error = this.#reviewClient.querySelector("#error").hidden = false;
        }else {

            //code for db

            const error = this.#reviewClient.querySelector("#error").hidden = true;
            const success = this.#reviewClient.querySelector("#success").hidden = false;


            this.#reviewRepsitory.createReview(null, customer_id, entrepreneur_id, command, rating, date);
        }
    }
}
