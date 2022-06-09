const req = require("express/lib/request");

class OrderRoutes {
	#errorCodes = require("../framework/utils/httpErrorCodes");
	#databaseHelper = require("../framework/utils/databaseHelper");
	#app;

	constructor(app) {
		this.#app = app;
		this.#getOrder();
		this.#getOrderByNum();
		this.#getOrderByNumAndZip();
		this.#countOrders();
		this.#deleteOrder();
		this.#countOrdersOmw();
		this.#countOrdersHere();
		this.#calculateEarningsToday();
		this.#calculateEarningsWeek();
		this.#calculateEarningsMonth();
		this.#calculateDonatedMoney();
		this.#getCompanyName();
		this.#calculateEarningsLastMonth();
		this.#calculateEarningsLastWeek();
		this.#calculateEarningsYesterday();
		this.#getPhonenumber();
		this.#saveOrder();
		this.#getOrderByInfo();
		this.#sortOrdersName();
		this.#getTodaysOrder();
		this.#getYesterdaysOrder();
		this.#getOrderDataTwoDaysAgo();
		this.#getOrderDataThreeDaysAgo();
		this.#getOrderDataFourDaysAgo();
		this.#getOrderDataFiveDaysAgo();
		this.#getOrderDataSevenDaysAgo();
		this.#getOrderDataTwoWeeksAgo();
		this.#getOrderDataThreeWeeksAgo();
		this.#getOrderDataFourWeeksAgo();
		this.#updateStatus();
		this.#getOrdersFromUser();
	}

	#getOrdersFromUser() {
		this.#app.get(
			"/order/getOrdersFromUser/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM `order` WHERE entrepreneur_id = ? ORDER BY order_date DESC LIMIT 60",
						values: [req.params.entrepreneur_id],
					});
					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}


	#saveOrder() {
		this.#app.put(
			"/order/saveorder/:order_id/:customer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "UPDATE `order` SET customer_id = ? WHERE order_id = ?",
						values: [
							req.params.customer_id, req.params.order_id,
						],
					});
					//just give all data back as json, could also be empty
					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrder() {
		this.#app.get("/order/getallfor", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "SELECT * FROM `order` ORDER BY order_date DESC",
				});
				//just give all data back as json, could also be empty
				res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
			} catch (e) {
				res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
					reason: e,
				});
			}
		});
	}

	#sortOrdersName() {
		this.#app.get("/order/getallforName", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "SELECT * FROM `order` ORDER BY order_date DESC",
				});
				//just give all data back as json, could also be empty
				res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
			} catch (e) {
				res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
					reason: e,
				});
			}
		});
	}

	#getOrderByInfo() {
		this.#app.get(
			"/order/getOrderByInfo/:info/:info/:info/:info",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM `order` INNER JOIN entrepreneur ON `order`.entrepreneur_id = entrepreneur.entrepreneur_id WHERE shipping_name = ? OR shipping_name = ? OR shipping_zip = ? OR order_id = ?",
						values: [
							req.params.info,
							req.params.info,
							req.params.info,
							req.params.info,
						],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderByNum() {
		this.#app.get(
			"/order/getorder/:order_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT *, MONTHNAME(`estimated_delivery`) as month, DAY(`estimated_delivery`) AS day, year(`estimated_delivery`) AS year FROM `order` INNER JOIN entrepreneur ON `order`.entrepreneur_id = entrepreneur.entrepreneur_id WHERE order_id = ?",
						values: [req.params.order_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderByNumAndZip() {
		this.#app.get(
			"/order/trackorder/:order_id/:shipping_zip",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM `order` INNER JOIN entrepreneur ON `order`.entrepreneur_id = entrepreneur.entrepreneur_id WHERE order_id = ? AND shipping_zip = ?",
						values: [
							req.params.order_id,
							req.params.shipping_zip,
						],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#countOrders() {
		this.#app.get(
			"/order/count/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) FROM `order` WHERE entrepreneur_id = ?",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						amount: data[0]["COUNT(order_id)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsToday() {
		this.#app.get(
			"/order/calculateearningstoday/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date = CURDATE()",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsYesterday() {
		this.#app.get(
			"/order/calculateearningsyesterday/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsWeek() {
		this.#app.get(
			"/order/calculateearningsweek/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date between date_sub(now(),INTERVAL 1 WEEK) and date_sub(now(),INTERVAL 0 WEEK);",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsLastWeek() {
		this.#app.get(
			"/order/calculateearningslastweek/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date between date_sub(now(),INTERVAL 2 WEEK) AND date_sub(now(), INTERVAL 1 WEEK);",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsMonth() {
		this.#app.get(
			"/order/calculateearningsmonth/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date >= DATE_ADD(curdate(), INTERVAL -30 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateEarningsLastMonth() {
		this.#app.get(
			"/order/calculateearningslastmonth/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(price) FROM `order` WHERE entrepreneur_id = ? AND order_date between date_sub(now(),INTERVAL -60 DAY) and date_sub(now(),INTERVAL -30 DAY);",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						price: data[0]["SUM(price)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#calculateDonatedMoney() {
		this.#app.get(
			"/order/calculatedonatedmoney/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(delivery_charge)*0.04 FROM `order` WHERE entrepreneur_id = ?",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						donatie: data[0]["SUM(delivery_charge)*0.04"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#countOrdersOmw() {
		this.#app.get(
			"/order/countomw/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: 'SELECT COUNT(order_id) FROM `order` WHERE entrepreneur_id = ? and status = "On the way"',
						values: [req.params.entrepreneur_id],
					});
					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						amount: data[0]["COUNT(order_id)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#countOrdersHere() {
		this.#app.get(
			"/order/counthere/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: 'SELECT COUNT(order_id) FROM `order` WHERE entrepreneur_id = ? and status = "Still to be picked up"',
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						amount: data[0]["COUNT(order_id)"],
					});
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#deleteOrder() {
		this.#app.delete("/order/deleteOrder/:order_id", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "DELETE FROM `order` WHERE `order_id` = ?",
					values: [req.params.order_id],
				});

				res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
			} catch (e) {
				res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
					reason: e,
				});
			}
		});
	}

	#getCompanyName() {
		this.#app.get(
			"/order/getcompanyname/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: " SELECT `order`.order_date, `order`.entrepreneur_id, `order`.order_id, entrepreneur.name FROM `order` INNER JOIN entrepreneur ON `order`.entrepreneur_id = entrepreneur.entrepreneur_id",
						values: [req.params.naam],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getTodaysOrder() {
		this.#app.get(
			"/order/getTodaysOrder/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = CURDATE()",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getYesterdaysOrder() {
		this.#app.get(
			"/order/getYesterdaysOrder/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataTwoDaysAgo() {
		this.#app.get(
			"/order/getOrderDataTwoDaysAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 2 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataThreeDaysAgo() {
		this.#app.get(
			"/order/getOrderDataThreeDaysAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 3 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataFourDaysAgo() {
		this.#app.get(
			"/order/getOrderDataFourDaysAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 4 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataFiveDaysAgo() {
		this.#app.get(
			"/order/getOrderDataFiveDaysAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 5 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataSevenDaysAgo() {
		this.#app.get(
			"/order/getOrderDataSevenDaysAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataTwoWeeksAgo() {
		this.#app.get(
			"/order/getOrderDataTwoWeeksAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 14 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataThreeWeeksAgo() {
		this.#app.get(
			"/order/getOrderDataThreeWeeksAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 21 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	#getOrderDataFourWeeksAgo() {
		this.#app.get(
			"/order/getOrderDataFourWeeksAgo/:entrepreneur_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(order_id) AS `Orders`, SUM(price) AS `Earnings` FROM `order` WHERE entrepreneur_id = ? AND order_date = DATE_SUB(CURDATE(), INTERVAL 28 DAY)",
						values: [req.params.entrepreneur_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}

	/**
	 * pakt de telefoonnummer van de order
	 */
	#getPhonenumber() {
		this.#app.get(
			"/order/getphonenumber/:order_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: " SELECT customer.phonenumber FROM `order` INNER JOIN customer ON `order`.customer_id = customer.customer_id WHERE `order`.order_id = ?",
						values: [req.params.order_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
				} catch (e) {
					res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
						reason: e,
					});
				}
			}
		);
	}
	//Update de status van de orderorder in de database
	#updateStatus() {
		this.#app.put("/order/:order_id/status", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "UPDATE `order` SET status = ? WHERE `order`.order_id = ?",
					values: [req.body.status, req.params.order_id],
				});

				res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
			} catch (e) {
				res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
					reason: e,
				});
			}
		});
	}
}

module.exports = OrderRoutes;
