/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */
const {request} = require("express");

class BezorgerRegRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;
        this.#createBezorger();
    }

    //mkmkm
    #createBezorger() {
        this.#app.post("/bezorger", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO `bezorger` (`bezorger_id`, `voornaam`, `achternaam`, `geboortedatum`, `adres`, `plaats`, `postcode`, `emailadres`, `telefoonnummer`, `wachwoord`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.bezorger_id, req.body.firstNameBezorger, req.body.surNameBezorger, req.body.datumBezorger, req.body.adresBezorger, req.body.plaatsBezorger, req.body.postcodeBezorger, req.body.emailBezorger, req.body.telefoonnummerBezorger, req.body.wachtwoordBezorger]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({bezorger_id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = BezorgerRegRoute;