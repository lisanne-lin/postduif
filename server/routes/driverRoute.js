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
            const emailadres = req.body.emailadres;

            const password = req.body.wachtwoord;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT e-mail_address, password FROM deliverer WHERE e-mail_address = ? AND password = ?",
                    values: [emailadres, password]
                });

                if (data.length === 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"emailadres": data[0].emailadres});
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong emailadres or password"});


                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = UsersRoutes