/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */

class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#login();
    }


    #login() {
        this.#app.post("/driver/login", async (req, res) => {
            const email_address = req.body.email_address;

            const password = req.body.password;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT email_address, password FROM deliverer WHERE email_address = ? AND password = ?",
                    values: [email_address, password]
                });

                if (data.length === 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"email_address": data[0].email_address});
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong email_address or password"});


                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = UsersRoutes