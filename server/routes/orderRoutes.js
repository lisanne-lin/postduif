class OrderRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;
        this.#getOrder();
        this.#getOrderByNum();
        this.#getOrderByNumAndZip();
        this.#countOrders();
        this.#deleteOrder();
        this.#countOrdersOmw()
        this.#countOrdersHere();
        this.#calculateEarningsToday();
        this.#calculateEarningsWeek();
        this.#calculateEarningsMonth();
        this.#calculateDonatedMoney();
        this.#getCompanyName();
        this.#calculateEarningsLastMonth();
        this.#calculateEarningsLastWeek();
        this.#calculateEarningsYesterday();
        this.#getPhonenumber();
        this.#saveOrder();
    }

    #saveOrder(){
        this.#app.put("/bestelling/saveorder/:bestelnummer/:Klant_klantnummer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE bestelling SET Klant_klantnummer = ? WHERE bestelnummer = ?",
                    values: [req.params.Klant_klantnummer, req.params.bestelnummer]
                });
                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        })
    }

    #getOrder() {
        this.#app.get("/bestelling/getallfor", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM bestelling ORDER BY besteldatum"
                });
                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getOrderByNum() {
        this.#app.get("/bestelling/getorder/:bestelnummer", async (req, res) => {
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

    #getOrderByNumAndZip() {
        this.#app.get("/bestelling/trackorder/:bestelnummer/:verzend_postcode", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id WHERE bestelnummer = ? AND verzend_postcode = ?",
                    values: [req.params.bestelnummer, req.params.verzend_postcode]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


    #countOrders() {
        this.#app.get("/bestelling/count/:Ondernemer_ondernemer_id", async (req, res) => {
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
        this.#app.get("/bestelling/calculateearningstoday/:Ondernemer_ondernemer_id", async (req, res) => {
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

    #calculateEarningsYesterday() {
        this.#app.get("/bestelling/calculateearningsyesterday/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateEarningsWeek() {
        this.#app.get("/bestelling/calculateearningsweek/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-7 AND curdate()",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateEarningsLastWeek() {
        this.#app.get("/bestelling/calculateearningslastweek/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-14 AND curdate()-7",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateEarningsMonth() {
        this.#app.get("/bestelling/calculateearningsmonth/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-30 AND curdate()",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateEarningsLastMonth() {
        this.#app.get("/bestelling/calculateearningslastmonth/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-60 AND curdate()-30",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"prijs": data[0]['SUM(prijs)']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #calculateDonatedMoney() {
        this.#app.get("/bestelling/calculatedonatedmoney/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(bezorgkosten)*0.04 FROM bestelling WHERE Ondernemer_ondernemer_id = 1",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({"donatie": data[0]['SUM(bezorgkosten)*0.04']});

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #countOrdersOmw() {
        this.#app.get("/bestelling/countomw/:Ondernemer_ondernemer_id", async (req, res) => {
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
        this.#app.get("/bestelling/counthere/:Ondernemer_ondernemer_id", async (req, res) => {
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

    #deleteOrder() {
        this.#app.post("/bestelling/delete/:bestelnummer", async (req, res) => {
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

    #getCompanyName() {
        this.#app.get("/bestelling/getcompanyname/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: " SELECT bestelling.besteldatum, bestelling.Ondernemer_ondernemer_id, bestelling.bestelnummer, ondernemer.naam FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id",
                    values: [req.params.naam]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
    /**
     * pakt de telefoonnummer van de bestelling
     */
    #getPhonenumber() {
        this.#app.get("/bestelling/getphonenumber/:bestelnummer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: " SELECT klant.telefoonnummer FROM bestelling INNER JOIN klant ON bestelling.Klant_klantnummer = klant.klantnummer WHERE bestelling.bestelnummer = ?",
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
