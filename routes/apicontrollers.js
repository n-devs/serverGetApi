var express = require('express');
var mysql = require('mysql');
var config = require('../config/database');
var querys = require('../querys/querys');
var router = express.Router();

// Register
router.post('/register', function(req, res) {
	//TODO : Validatetion
	var name = req.body.name;
	var birthday = req.body.birthday;
	var gender = req.body.gender;
	var phonenumber = req.body.phonenumber;
	var email = req.body.email;
	var password = req.body.password;

	var connection = mysql.createConnection(config);

	connection.query(querys.users.isInTheDatabase, [ email, password ], function(error, results, fields) {
		if (error) throw res.send(error);
		if (!(results.length >= 1)) {
			var connection = mysql.createConnection(config);
			connection.query(querys.users.create, [ name, birthday, gender, phonenumber, email, password ], function(
				error,
				results,
				fields
			) {
				if (error)
					throw res.json({
						status: 1,
						error: error
					});
				res.json({
					status: 1,
					userId: results.insertId,
					error: null
				});
			});
		} else {
			res.json({
				status: 0,
				error: 'This user is already in the database'
			});
		}
	});

	connection.end();
});

// Add store to the database
router.post('/store', (req, res) => {
	//TODO : Validation
	var storeName = req.body.storeName;
	var storeAddress = req.body.storeAddress;
	var storeSubDistrict = req.body.storeSubDistrict;
	var storeDistrict = req.body.storeDistrict;
	var storeProvince = req.body.storeProvince;
	var storePostalCode = req.body.storePostalCode;
	var userId = req.body.userId;
	var userStatus = req.body.userStatus;

	var connection = mysql.createConnection(config);
	connection.query(
		querys.stores.create,
		[ storeName, storeAddress, storeSubDistrict, storeDistrict, storeProvince, storePostalCode ],
		(error, results, fields) => {
			if (error)
				throw res.json({
					status: 0,
					error: error
				});
			var storeId = results.insertId;
			var connection = mysql.createConnection(config);
			connection.query(querys.userInStores.create, [ userId, storeId, userStatus ], (error, results, fields) => {
				if (error)
					throw res.json({
						status: 0,
						error: error
					});
				res.json({
					status: 1,
					storeId: storeId,
					error: null
				});
			});
		}
	);
});

// Add product to the databasse
router.post('/product', (req, res) => {
	// TODO : Validation
	var productBarcode = req.body.productBarcode;
	var productName = req.body.productName;
	var productBrand = req.body.productBrand;
	var productManufacturer = req.body.productManufacturer;
	var productSize = req.body.productSize;
	var productStatus = req.body.productStatus;

	var connection = mysql.createConnection(config);

	// Check if product is in the database or not
	connection.query(querys.products.isInTheDatabase, [ productBarcode, productBrand ], (error, results, fields) => {
		if (error)
			throw res.json({
				status: 0,
				error: error
			});
		if (!(results[0].result >= 1)) {
			var connection = mysql.createConnection(config);

			// Add product to products
			connection.query(
				querys.products.create,
				[ productBarcode, productName, productBrand, productManufacturer, productSize, productStatus ],
				(error, results, fields) => {
					if (error)
						throw res.json({
							status: 0,
							error: error
						});

					res.json({
						status: 1,
						productId: results.insertId,
						error: null
					});
				}
			);
		} else
			res.json({
				status: 0,
				error: 'This product is already in the database'
			});
	});
});

router
	.route('/product/:productBarcodeOrId/store/:storeId')
	// Get product from the database
	.get((req, res) => {
		var productBarcode = req.params.productBarcodeOrId;
		var storeId = req.params.storeId;

		var connection = mysql.createConnection(config);

		connection.query(querys.products.get, [ productBarcode, storeId ], (error, results, fields) => {
			if (error)
				throw res.json({
					status: 0,
					error: error
				});
			if (result) {
				res.json(results);
			} else {
				res.json({
					status: 0,
					error: 'This product is not in the database.'
				});
			}
		});
	})
	// Add product to store
	.post((req, res) => {
		//TODO : Validation
		var productId = req.params.productBarcodeOrId;
		var storeId = req.params.storeId;
		var productCost = req.body.productCost;
		var productQuantity = req.body.productQuantity;
		var productPrice = req.body.productPrice;
		var productMinimumQuantity = req.body.productMinimumQuantity;

		var connection = mysql.createConnection(config);

		connection.query(querys.productInStores.isInTheDatabase, [ productId, storeId ], (error, results, fields) => {
			if (error)
				throw res.json({
					status: 0,
					error: error
				});
			if (!(results[0].result >= 1)) {
				var connection = mysql.createConnection(config);
				connection.query(
					querys.productInStores.create,
					[ productId, storeId, productQuantity, productPrice, productMinimumQuantity ],
					(error, results, fields) => {
						if (error)
							throw res.json({
								status: 0,
								error: error
							});

						res.json({
							status: 1,
							error: null
						});
					}
				);
			} else {
				var connection = mysql.createConnection(config);
				connection.query(
					querys.productLog.create,
					[
						productId,
						storeId,
						querys.functions.CURRENT_TIMESTAMP,
						productQuantity,
						productCost,
						productPrice
					],
					(error, results, fields) => {
						if (error)
							throw res.json({
								status: 0,
								error: error
							});
					}
				);

				connection.query(
					querys.productInStores.update,
					[ productQuantity, productPrice, productMinimumQuantity, productId, storeId ],
					(error, results, fields) => {
						if (error)
							throw res.json({
								status: 0,
								error: error
							});
						res.json({
							status: 1,
							error: null
						});
					}
				);
			}
		});
	});

//Login
router.post('/login', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;

	var connection = mysql.createConnection(config);

	connection.query(querys.users.isInTheDatabase, [ email, password ], (error, results, fields) => {
		if (error)
			res.json({
				status: 0,
				error: error
			});

		if (results.length === 1) {
			var userId = results[0].user_id;

			var connection = mysql.createConnection(config);
			connection.query(querys.users.getUserStoreList, [ userId ], (error, results, fields) => {
				if (error)
					throw res.json({
						status: 0,
						error: error
					});
				res.json({
					status: 1,
					user_id: userId,
					userStoreList: results,
					error: null
				});
			});
		} else
			res.json({
				status: 0,
				error: 'wrong username or password'
			});
	});
});

// TODO : Finish this api
router.post('/store/receipt', (req, res) => {
	var userId = req.body.userId;
	var storeId = req.body.storeId;
	var receiptTotalPrice = req.body.receiptTotalPrice;
	var customerMoneyPaid = req.body.customerMoneyPaid;
	var receiptMoneyChange = req.body.receiptMoneyChange;
	var productDetail = req.body.productDetail;

	var connection = mysql.createConnection(config);

	connection.query(
		querys.receipt.create,
		[
			userId,
			storeId,
			querys.functions.CURRENT_TIMESTAMP,
			receiptTotalPrice,
			customerMoneyPaid,
			receiptMoneyChange
		],
		(error, results, fields) => {
			if (error)
				throw res.json({
					status: 0,
					error: error
				});

			var receiptId = results.insertId;

			productDetail.forEach((element) => {
				var connection = mysql.createConnection(config);

				connection.query(
					querys.receiptProductDetail.create,
					[
						receiptId,
						productDetail.productId,
						productDetail.saleQuantity,
						productDetail.salePrice,
						productDetail.saleTotalPrice
					],
					(error, results, fields) => {}
				);
			});

			connection.end();
		}
	);
});
module.exports = router;
