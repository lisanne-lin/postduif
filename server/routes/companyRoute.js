/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */
const {request} = require("express");

class CompanyRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");
    #errorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;
        this.#createReview();
        this.#getReviewsById();
        this.#getAbout();
        this.#getOndernemerInfoByID();
    }

    #getReviewsById() {
        this.#app.get("/review/getReviews/:id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM review INNER JOIN customer ON review.customer_id = customer.customer_id WHERE entrepreneur_id = ? ",
                    values: [req.params.id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


    #getOndernemerInfoByID() {
        this.#app.get("/review/getOndernemer/:id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT name, address, place, zip, phonenumber, initiative FROM entrepreneur WHERE entrepreneur_id = ?",
                    values: [req.params.id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


    #createReview() {
        this.#app.post("/review", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO review (review_id, customer_id, entrepreneur_id, text, rating, date) VALUES (?, ?, ?, ?, ?, ?)",
                    values: [req.body.id, req.body.customer_id, req.body.entrepreneur_id, req.body.command, req.body.rating, req.body.review_date]
                });

                if (data.insertId) {
                    // res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({data: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #getAbout() {
        this.#app.get("/about/abouts/", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT entrepreneur_id, name, owner, address, place, zip, phonenumber, emailaddress FROM entrepreneur ",

                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


}

module.exports = CompanyRoute;