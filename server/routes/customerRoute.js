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
        this.#login()
        this.#getIdFromemailaddress()
    }

    #getIdFromemailaddress() {
        this.#app.get("/customer/getIdFromemailaddress/:emailaddress", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT customer_id, first_name, last_name FROM customer WHERE emailaddress = ?",
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

    #login() {
        this.#app.post("/customer/login", async (req, res) => {
            const emailaddress = req.body.emailaddress;
            const password = req.body.password;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT emailaddress, password FROM customer WHERE emailaddress = ? AND password = ?",
                    values: [emailaddress, password]
                });

                if (data.length === 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"emailaddress": data[0].emailaddress});
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong emailaddress or password"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getCustomers() {
        this.#app.get("/customer/getallfor/:entrepreneur_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT distinct emailaddress, phonenumber, customer.customer_id, place, first_name, last_name FROM customer LEFT JOIN `order` ON customer.customer_id = `order`.customer_id WHERE `order`.entrepreneur_id = ? ORDER BY `order`.order_date",
                    values: [req.params.entrepreneur_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getCustomerByEmail() {
        this.#app.get("/customer/getcustomer/:emailaddress", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT distinct emailaddress, phonenumber, customer_id, place, first_name, last_name FROM customer WHERE emailaddress LIKE \"%\"? \"%\";",
                    values: [req.params.emailaddress]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #createCustomerAccount() {
        this.#app.post("/customer/createcustomer", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO customer (customer_id, first_name, last_name, emailaddress, phonenumber, place, address, zip, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    values: [req.body.customer_id, req.body.first_name, req.body.last_name, req.body.emailaddress, req.body.phonenumber, req.body.place, req.body.address, req.body.zip, req.body.password]
                });

                if (data.insertId) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({customer_id: data.insertId});
                }

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #getCustomerById() {
        this.#app.get("/customer/getcustomerbyid/:customer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM customer WHERE customer_id = ?;",
                    values: [req.params.customer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getOrdersFromCustomer() {
        this.#app.get("/customer/getordersfromcustomer/:customer_id", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT order_id, shipping_name, shipping_address, shipping_place, shipping_zip, MONTHNAME(`estimated_delivery`) as `month`, DAY(`estimated_delivery`) AS `day`, year(`estimated_delivery`) AS `year`, shipping_date, delivery_charge, remark, delivery_person_id, customer.customer_id, order_date, status, price, entrepreneur.name FROM `order` INNER JOIN customer ON `order`.customer_id = customer.customer_id INNER JOIN entrepreneur ON `order`.entrepreneur_id = entrepreneur.entrepreneur_id WHERE customer.customer_id = ? ORDER BY estimated_delivery DESC",
                    values: [req.params.customer_id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

}

module.exports = CustomerRoute
