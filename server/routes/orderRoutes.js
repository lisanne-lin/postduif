class OrderRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        //call method per route for the rooms entity
        this.#getOrder();
        this.#getOrderByNum();
        this.#countOrders();
        this.#deleteOrder();
        this.#countOrdersOmw()
        this.#countOrdersHere();
        this.#calculateEarningsToday()
    }

    #getOrder() {
        this.#app.get("/bestelling", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, besteldatum, status FROM bestelling ORDER BY besteldatum"
                });
                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getOrderByNum() {
        this.#app.get("/bestelling/:bestelnummer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM bestelling WHERE bestelnummer = ?",
                    values: [req.params.bestelnummer]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #countOrders() {
        this.#app.get("/bestelling/:Ondernemer_ondernemer_id/count", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ?",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"aantal": data[0]['COUNT(bestelnummer)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateEarningsToday() {
        this.#app.get("/bestelling/:Ondernemer_ondernemer_id/calculateearningstoday", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = CURDATE()",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #countOrdersOmw() {
        this.#app.get("/bestelling/:Ondernemer_ondernemer_id/countomw", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ? and status = \"On the way\"",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"aantal": data[0]['COUNT(bestelnummer)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #countOrdersHere() {
        this.#app.get("/bestelling/:Ondernemer_ondernemer_id/counthere", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ? and status = \"Still to be picked up\"",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"aantal": data[0]['COUNT(bestelnummer)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #updateOrder(verzendadres, verzendplaats, verzend_postcode, status, geschatte_bezorgdatum) {
        this.#app.post("/bestelling/:bestelnummer/update", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE `bestelling` SET `verzend_postcode` = ?, `verzendplaats` = ?, `verzend_postcode` = ?, `status` = ?, `geschatte_bezorgdatum` = ? WHERE bestelnummer = ? ",
                    values: [req.body.verzend_postcode, req.body.verzendplaats, req.body.verzend_postcode, req.body.status, req.body.geschatte_bezorgdatum, req.body.bestelnummer]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #deleteOrder() {
        this.#app.post("/bestelling/:bestelnummer/delete", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "DELETE FROM `bestelling` WHERE `bestelnummer` = ?",
                    values: [req.params.bestelnummer]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = OrderRoutes
