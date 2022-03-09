/**
 * Routes file voor dashboard van de ondernemer
 * @author Simon Vriesema
 */
const {request} = require("express");

class DashboardRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")

    constructor(app) {
        this.#app = app;
        this.#createOrder();
    }

    #createOrder() {
        this.#app.post("/dashboard", (req, res) => {
            try {
                this.#databaseHelper.handleQuery({
                    query: "INSERT INTO bestelling (bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, verzend_datum, bezorgkosten, opmerking, Bezorger_bezorger_id, Klant_klantnummer, Ondernemer_ondernemer_id, besteldatum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.bestelnummer, req.body.verzendnaam, req.body.verzendadres, req.body.verzendplaats, req.body.verzend_postcode, req.body.geschatte_bezorgdatum, req.body.verzend_datum, req.body.bezorgkosten, req.body.opmerking, req.body.Bezorger_bezorger_id, req.body.Klant_klantnummer, req.body.Ondernemer_ondernemer_id, req.body.besteldatum]
                })
            } catch (e) {
                
            }
            // res.json({"bestelling":req.body});
        })
    }
}

module.exports = DashboardRoute;
