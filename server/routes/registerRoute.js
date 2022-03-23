/**
 * Routes file for register for the entrepreneur
 * @author Simon Vriesema
 */
const {request} = require("express");

class RegisterRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;
        this.#createEntrepreneurAccount();
    }

    #createEntrepreneurAccount() {
        this.#app.post("/ondernemer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO ondernemer (ondernemer_id, `naam`, `eigenaar`, `adres`, `plaats`, `postcode`, `telefoonnummer`, `emailadres`, `wachtwoord`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.ondernemer_id, req.body.naam, req.body.eigenaar, req.body.adres, req.body.plaats, req.body.postcode, req.body.telefoonnummer, req.body.emailadres, req.body.wachtwoord]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ondernemer_id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = RegisterRoute;