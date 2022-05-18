class CustomerRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;
        this.#getCustomers();
        this.#getCustomerByEmail();
        this.#createCustomerAccount();
        this.#getCustomerById()
        this.#getOrdersFromCustomer()
    }

    #getCustomers() {
        this.#app.get("/klant/getallfor/:Ondernemer_ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT distinct emailadres, telefoonnummer, klantnummer, plaats, voornaam, achternaam FROM klant LEFT JOIN bestelling ON klant.klantnummer = bestelling.Klant_klantnummer WHERE bestelling.Ondernemer_ondernemer_id = ? ORDER BY bestelling.besteldatum",
                    values: [req.params.Ondernemer_ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getCustomerByEmail() {
        this.#app.get("/klant/getcustomer/:emailadres", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT distinct emailadres, telefoonnummer, klantnummer, plaats, voornaam, achternaam FROM klant WHERE emailadres LIKE \"%\"? \"%\";",
                    values: [req.params.emailadres]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #createCustomerAccount() {
        this.#app.post("/klant/createcustomer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO klant (klantnummer, voornaam, achternaam, emailadres, telefoonnummer, plaats, adres, postcode, wachtwoord) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.klantnummer, req.body.voornaam, req.body.achternaam, req.body.emailadres, req.body.telefoonnummer, req.body.plaats, req.body.adres, req.body.postcode, req.body.wachtwoord]
                });

                if (data.insertId) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({klantnummer: data.insertId});
                }

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #getCustomerById() {
        this.#app.get("/klant/getcustomerbyid/:klantnummer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM klant WHERE klantnummer = ?;",
                    values: [req.params.klantnummer]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getOrdersFromCustomer() {
        this.#app.get("/klant/getordersfromcustomer/:klantnummer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, MONTHNAME(`geschatte_bezorgdatum`) as bestelmaand, DAY(`geschatte_bezorgdatum`) AS dag, year(`geschatte_bezorgdatum`) AS jaar, verzend_datum, bezorgkosten, opmerking, Bezorger_bezorger_id, Ondernemer_ondernemer_id, besteldatum, status, prijs, ondernemer.naam FROM bestelling INNER JOIN klant ON bestelling.Klant_klantnummer = klant.klantnummer INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id WHERE klant.klantnummer = ? ORDER BY geschatte_bezorgdatum DESC ",
                    values: [req.params.klantnummer]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

}

module.exports = CustomerRoute
