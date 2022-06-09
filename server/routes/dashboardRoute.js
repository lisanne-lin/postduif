/**
 * Routes file voor dashboard van de ondernemer
 * @author Simon Vriesema
 */
const {request} = require("express");

class DashboardRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;
        this.#createOrder();
    }

    #createOrder() {
        this.#app.post("/order", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO order (order_id, shipping_name, shipping_address, shipping_place, shipping_zip, estimated_delivery, shipping_date, delivery_charge, remark, delivery_person_id, customer_id, entrepreneur_id, order_date, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.order_id, req.body.shipping_name, req.body.shipping_address, req.body.shipping_place, req.body.shipping_zip, req.body.estimated_delivery, req.body.shipping_date, req.body.delivery_charge, req.body.remark, req.body.delivery_person_id, req.body.customer_id, req.body.entrepreneur_id, req.body.order_date, req.body.price]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({order_id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = DashboardRoute;
