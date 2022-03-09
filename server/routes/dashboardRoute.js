/**
 * Routes file voor dashboard van de ondernemer
 * @author Simon Vriesema
 */
const {request} = require("express");

class DashboardRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;
        this.#createOrder();
    }

    #createOrder() {
        this.#app.post("/dashboard", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO bestelling (bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, verzend_datum, bezorgkosten, opmerking, Bezorger_bezorger_id, Klant_klantnummer, Ondernemer_ondernemer_id, besteldatum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.bestelnummer, req.body.verzendnaam, req.body.verzendadres, req.body.verzendplaats, req.body.verzend_postcode, req.body.geschatte_bezorgdatum, req.body.verzend_datum, req.body.bezorgkosten, req.body.opmerking, req.body.Bezorger_bezorger_id, req.body.Klant_klantnummer, req.body.Ondernemer_ondernemer_id, req.body.besteldatum]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = DashboardRoute;
