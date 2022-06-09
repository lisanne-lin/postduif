class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    constructor(app) {
        this.#app = app;

        this.#login();
        this.#getEntrepreneurById();
        this.#getIdFromemailaddress();
    }

    #getIdFromemailaddress() {
        this.#app.get("/entrepreneur/getIdFromemailaddress/:emailaddress", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT entrepreneur_id, name FROM entrepreneur WHERE emailaddress = ?",
                    values: [req.params.emailaddress],
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    reason: e,
                });
            }
        });
    }

    /**
     * Checks if passed username and password are found in db, if so let the front-end know
     * @private
     */
    #login() {
        this.#app.post("/entrepreneur/login", async (req, res) => {
            const emailaddress = req.body.emailaddress;

            const password = req.body.password;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT emailaddress, password, entrepreneur_id  FROM entrepreneur WHERE emailaddress = ? AND password = ?",
                    values: [emailaddress, password]
                });

                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    //return just the username for now, never send password back!
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"emailaddress": data[0].emailaddress});
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong emailaddress or password"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getEntrepreneurById(id) {
        this.#app.get("/entrepreneur/getentrepreneur/:entrepreneur_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM entrepreneur WHERE entrepreneur_id = ?",
                    values: [req.params.entrepreneur_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = UsersRoutes