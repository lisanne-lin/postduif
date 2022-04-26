/**
 * This class contains ExpressJS routes specific for the users entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */
class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        this.#login()
        this.#getEntrepreneurById()
    }

    /**
     * Checks if passed username and password are found in db, if so let the front-end know
     * @private
     */
    #login() {
        this.#app.post("/ondernemer/login", async (req, res) => {
            const emailadres = req.body.emailadres;

            //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
            const wachtwoord = req.body.wachtwoord;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT emailadres, wachtwoord FROM ondernemer WHERE emailadres = ? AND wachtwoord = ?",
                    values: [emailadres, wachtwoord]
                });

                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    //return just the username for now, never send password back!
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"emailadres": data[0].emailadres});
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong emailadres or password"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getEntrepreneurById(id) {
        this.#app.get("/ondernemer/getentrepreneur/:ondernemer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM ondernemer WHERE ondernemer_id = ?",
                    values: [req.params.ondernemer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = UsersRoutes