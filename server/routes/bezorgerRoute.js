/**
 *
 * this file is automatically loaded in app.js
 *
 * @author Joy Park
 */

class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#login();
    }


    #login() {
        this.#app.post("/bezorger/login", async (req, res) => {
            const emailadres = req.body.emailadres;

            const wachtwoord = req.body.wachtwoord;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT emailadres, wachwoord FROM bezorger WHERE emailadres = ? AND wachwoord = ?",
                    values: [emailadres, wachtwoord]
                });

                if (data.length === 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"emailadres": data[0].emailadres});
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong emailadres or password XD"});


                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = UsersRoutes