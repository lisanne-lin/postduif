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
			"/bestelling/getOrdersFromUser/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM bestelling WHERE Ondernemer_ondernemer_id = ?",
						values: [req.params.Ondernemer_ondernemer_id],
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

	#saveOrder() {
		this.#app.put(
			"/bestelling/saveorder/:bestelnummer/:Klant_klantnummer",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "UPDATE bestelling SET Klant_klantnummer = ? WHERE bestelnummer = ?",
						values: [
							req.params.Klant_klantnummer,
							req.params.bestelnummer,
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
		this.#app.get("/bestelling/getallfor", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "SELECT * FROM bestelling ORDER BY besteldatum DESC",
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
		this.#app.get("/bestelling/getallforName", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "SELECT * FROM bestelling ORDER BY besteldatum DESC",
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
			"/bestelling/getOrderByInfo/:info/:info/:info/:info",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id WHERE verzendnaam = ? OR verzendadres = ? OR verzend_postcode = ? OR bestelnummer = ?",
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
			"/bestelling/getorder/:bestelnummer",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id WHERE bestelnummer = ?",
						values: [req.params.bestelnummer],
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
			"/bestelling/trackorder/:bestelnummer/:verzend_postcode",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT * FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id WHERE bestelnummer = ? AND verzend_postcode = ?",
						values: [
							req.params.bestelnummer,
							req.params.verzend_postcode,
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
			"/bestelling/count/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ?",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						aantal: data[0]["COUNT(bestelnummer)"],
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
			"/bestelling/calculateearningstoday/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = CURDATE()",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculateearningsyesterday/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculateearningsweek/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-7 AND curdate()",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculateearningslastweek/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-14 AND curdate()-7",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculateearningsmonth/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-30 AND curdate()",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculateearningslastmonth/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(prijs) FROM bestelling WHERE Ondernemer_ondernemer_id = 1 AND besteldatum BETWEEN curdate()-60 AND curdate()-30",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						prijs: data[0]["SUM(prijs)"],
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
			"/bestelling/calculatedonatedmoney/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT SUM(bezorgkosten)*0.04 FROM bestelling WHERE Ondernemer_ondernemer_id = 1",
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						donatie: data[0]["SUM(bezorgkosten)*0.04"],
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
			"/bestelling/countomw/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: 'SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ? and status = "On the way"',
						values: [req.params.Ondernemer_ondernemer_id],
					});
					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						aantal: data[0]["COUNT(bestelnummer)"],
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
			"/bestelling/counthere/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: 'SELECT COUNT(bestelnummer) FROM bestelling WHERE Ondernemer_ondernemer_id = ? and status = "Still to be picked up"',
						values: [req.params.Ondernemer_ondernemer_id],
					});

					res.status(this.#errorCodes.HTTP_OK_CODE).json({
						aantal: data[0]["COUNT(bestelnummer)"],
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
		this.#app.post("/bestelling/delete/:bestelnummer", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "DELETE FROM `bestelling` WHERE `bestelnummer` = ?",
					values: [req.params.bestelnummer],
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
			"/bestelling/getcompanyname/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: " SELECT bestelling.besteldatum, bestelling.Ondernemer_ondernemer_id, bestelling.bestelnummer, ondernemer.naam FROM bestelling INNER JOIN ondernemer ON bestelling.Ondernemer_ondernemer_id = ondernemer.ondernemer_id",
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
			"/bestelling/getTodaysOrder/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = CURDATE()",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getYesterdaysOrder/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataTwoDaysAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 2 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataThreeDaysAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 3 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataFourDaysAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 4 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataFiveDaysAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 5 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataSevenDaysAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataTwoWeeksAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 14 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataThreeWeeksAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 21 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
			"/bestelling/getOrderDataFourWeeksAgo/:Ondernemer_ondernemer_id",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: "SELECT COUNT(bestelnummer) AS `Orders`, SUM(prijs) AS `Earnings` FROM bestelling WHERE Ondernemer_ondernemer_id = ? AND besteldatum = DATE_SUB(CURDATE(), INTERVAL 28 DAY)",
						values: [req.params.Ondernemer_ondernemer_id],
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
	 * pakt de telefoonnummer van de bestelling
	 */
	#getPhonenumber() {
		this.#app.get(
			"/bestelling/getphonenumber/:bestelnummer",
			async (req, res) => {
				try {
					const data = await this.#databaseHelper.handleQuery({
						query: " SELECT klant.telefoonnummer FROM bestelling INNER JOIN klant ON bestelling.Klant_klantnummer = klant.klantnummer WHERE bestelling.bestelnummer = ?",
						values: [req.params.bestelnummer],
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
	//Update de status van de bestelling in de database
	#updateStatus() {
		this.#app.put("/bestelling/:bestelnummer/status", async (req, res) => {
			try {
				const data = await this.#databaseHelper.handleQuery({
					query: "UPDATE bestelling SET status = ? WHERE bestelling.bestelnummer = ?",
					values: [req.body.status, req.params.bestelnummer],
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
