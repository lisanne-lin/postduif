class CustomerRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;
        this.#getCustomers();
        this.#getCustomerByEmail();
        this.#createCustomerAccount();
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
        this.#app.post("/klant", async (req, res) => {
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
}

module.exports = CustomerRoute
