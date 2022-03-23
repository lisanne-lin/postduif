/**
 * This class contains ExpressJS routes specific for the roomsExample entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */

class OrderRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the rooms entity
        this.#getOrder();
        this.#getOrderByNum();
    }

    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #getOrder() {
        this.#app.get("/bestelling", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, besteldatum, status FROM bestelling"
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
                    query: "SELECT bestelnummer, verzendnaam, verzendadres, verzendplaats, verzend_postcode, geschatte_bezorgdatum, besteldatum, status FROM bestelling WHERE bestelnummer = ?",
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