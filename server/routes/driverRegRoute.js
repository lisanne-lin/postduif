/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */
const {request} = require("express");

class DriverRegRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;
        this.#createBezorger();
    }


    #createBezorger() {
        this.#app.post("/driver", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO deliverer (deliverer_id, first_name, last_name, address, place, zip, email_address, phonenumber, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.deliverer_id, req.body.firstNameDriver, req.body.surNameDriver, req.body.addressDriver, req.body.placeDriver, req.body.zipDriver, req.body.emailDriver, req.body.phonenumberDriver, req.body.passwordDriver]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({deliverer_id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = DriverRegRoute;