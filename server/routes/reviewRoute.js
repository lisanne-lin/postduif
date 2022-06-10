/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */
const {request} = require("express");

class ReviewRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");
    #errorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;
        this.#createReview();
        this.#getReviewById();
        this.#getEntrepreneurInfoByID();
    }

    #getReviewById() {
        this.#app.get("/review/reviewsById/:id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM review INNER JOIN entrepreneur ON review.`entrepreneur_id` = entrepreneur.entrepreneur_id WHERE review.entrepreneur_id = ?",
                    values: [req.params.id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


    #getEntrepreneurInfoByID() {
        this.#app.get("/review/getEntrepreneur/:id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT name, address, place, zip, phonenumber FROM entrepreneur WHERE entrepreneur_id = ?",
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
}

module.exports = ReviewRoute;