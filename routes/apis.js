var express = require('express');
var mysql = require('mysql');
var config = require('../config/database');
var querys = require('../querys/querys');
var router = express.Router();

// Register
router.post('/register', function (req, res) {
	//TODO : Validatetion
	var name = req.body.name;
	var birthday = req.body.birthday;
	var gender = req.body.gender;
	var phonenumber = req.body.phonenumber;
	var email = req.body.email;
	var password = req.body.password;

	var connection = mysql.createConnection(config);

	// Check if this user is already in the database
	connection.query(querys.users.isInTheDatabase, [email, password], (error, results, fields) => {
		if (error) throw res.status(404).json({
			status: 0,
			error: error
		});
		// If user is not in the database then create
		if (!(results.length >= 1)) {
			var connection = mysql.createConnection(config);
			connection.query(querys.users.create, [name, birthday, gender, phonenumber, email, password], (error, results, fields) => {
				if (error)
					throw res.status(404).json({
						status: 1,
						error: error
					});
				res.status(201).json({
					status: 1,
					userId: results.insertId,
					error: null
				});
			});
		} else {
			res.status(409).json({
				status: 0,
				error: 'This user is already in the database'
			});
		}
	});
});
// Login
router.post('/login', (req, res) => {
	// TODO : Validation
	var email = req.body.email;
	var password = req.body.password;

	var connection = mysql.createConnection(config);

	// Check if user is in the database
	connection.query(querys.users.isInTheDatabase, [email, password], (error, results, fields) => {
		if (error)
			res.status(404).json({
				status: 0,
				error: error
			});

		if (results.length === 1) {
			var userId = results[0].user_id;

			var connection = mysql.createConnection(config);
			connection.query(querys.users.getUserStoreList, [userId], (error, results, fields) => {
				if (error)
					throw res.status(404).json({
						status: 0,
						error: error
					});
				res.json({
					status: 1,
					userId: userId,
					userStoreList: results,
					error: null
				});
			});
		} else
			res.status(404).json({
				status: 0,
				error: 'wrong username or password'
			});
	});
});
// Add store to the database
router.route('/stores')
	.post((req, res) => {
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

		// Check if this store name in the database
		connection.query(querys.stores.isInTheDatabaseSpecificName, [storeName], (error, results, fields) => {
			if (error)
				throw res.status(404).json({
					status: 0,
					error: error
				});
			if (!(results.length >= 1)) {
				var connection = mysql.createConnection(config);
				// Add store to the database
				connection.query(
					querys.stores.create, [storeName, storeAddress, storeSubDistrict, storeDistrict, storeProvince, storePostalCode],
					(error, results, fields) => {
						if (error)
							throw res.status(404).json({
								status: 0,
								error: error
							});
						var storeId = results.insertId;
						var connection = mysql.createConnection(config);
						// Bind store_id to user_id
						connection.query(
							querys.userInStores.create, [userId, storeId, userStatus],
							(error, results, fields) => {
								if (error)
									throw res.json({
										status: 0,
										error: error
									});
								res.status(201).json({
									status: 1,
									storeId: storeId,
									error: null
								});
							}
						);
					}
				);
			} else
				res.status(409).json({
					status: 0,
					error: 'This store is already in the database'
				});
		});
	})
	.get((req, res) => {
		const connection = mysql.createConnection(config);

		// Check if there is any store in the database
		connection.query(querys.stores.isInTheDatabase,
			(error, results, fields) => {
				if (error) throw res.status(404).json({
					status: 0,
					error: error
				});

				// If table is not empty then response all of the store back
				if (results.length >= 1) {
					const connection = mysql.createConnection(config);
					connection.query(querys.stores.getStores,
						(error, results, fields) => {
							if (error) throw res.status(404).json({
								status: 0,
								error: error
							});
							res.json({
								stores: results
							});
						}
					)
					// If table is empty
				} else res.status(404).json({
					status: 0,
					error: 'Stores is Empty'
				})
			})



		connection
	});
router.route('/stores/:storeId')
	.get((req, res) => {
		const connection = mysql.createConnection(config);
		const storeId = req.params.storeId;

		// Check if store is in the database
		connection.query(querys.stores.isInTheDatabaseSpecificId, [storeId],
			(error, results, fields) => {
				if (error) throw res.status(404).json({
					status: 0,
					error
				});

				// If there is
				if (results.length >= 1) {
					const connection = mysql.createConnection(config);
					connection.query(querys.stores.getStore, [storeId],
						(error, results, fields) => {
							const connection = mysql.createConnection(config);
							if (error) throw res.status(404).json({
								status: 0,
								error
							});

							let [{
								storeId,
								storeName,
								storeAddress,
								storeSubDistrict,
								storeDistrict,
								storeProvince,
								storePostalCode
							}] = results;

							connection.query(querys.userInStores.getUserInStore, [storeId],
								(error, results, fields) => {
									if (error) throw res.status(404).json({
										status: 0,
										error
									});


									res.json({
										storeId,
										storeName,
										storeAddress,
										storeSubDistrict,
										storeDistrict,
										storeProvince,
										storePostalCode,
										storeMember: results
									});
								})


						})
					// If there isn't
				} else res.status(404).json({
					status: 0,
					error: 'This store is not in the database.'
				});
			})
	})
	// TODO : Add algorithum
	.put((req, res) => {
		res.status(404).end('In the process of making PUT')
	})
	// TODO : Add algorithum
	.delete((req, res) => {
		res.status(404).end('In the process of making DELETE')
	});

// TODO : Finish this when have time
// router.get('users/:userId/stores', ((req, res) => {
// 	const userId = req.params.userId;
// 	const connection = mysql.createConnection(config);

// 	connect.query();


// }));
// Manipulate product in the the databasse
router.route('/products')
	// Add product to the database
	.post((req, res) => {
		// TODO : Validation
		var productBarcode = req.body.productBarcode;
		var productName = req.body.productName;
		var productBrand = req.body.productBrand;
		var productManufacturer = req.body.productManufacturer;
		var productSize = req.body.productSize;
		var productStatus = req.body.productStatus;

		var connection = mysql.createConnection(config);

		// Check if product is in the database or not
		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode], (error, results, fields) => {
			if (error)
				throw res.status(404).json({
					status: 0,
					error: error
				});
			if (!(results.length >= 1)) {
				var connection = mysql.createConnection(config);

				// Add product to the database
				connection.query(
					querys.products.create, [productBarcode, productName, productBrand, productManufacturer, productSize, productStatus],
					(error, results, fields) => {
						if (error)
							throw res.status(404).json({
								status: 0,
								error: error
							});

						res.status(201).json({
							status: 1,
							productId: results.insertId,
							error: null
						});
					}
				);
			} else
				res.status(409).json({
					status: 0,
					error: 'This product is already in the database'
				});
		});
	})
	// Get all of the product detail in the database
	.get((req, res) => {
		var connection = mysql.createConnection(config);

		connection.query(querys.products.isInTheDatabase,
			(error, results, fields) => {
				if (error) throw res.status(404).json({
					status: 0,
					error: error
				});

				if (results.length >= 1) {
					const connection = mysql.createConnection(config);
					connection.query(querys.products.getProducts,
						(error, results, fields) => {
							if (error) throw res.status(404).json({
								status: 0,
								error: error
							});
							res.json({
								products: results
							});
						})
				} else res.status(404).json({
					status: 0,
					error: 'Product table is empty'
				});
			})


	});

// Manipulate product in the the databasse (Single)
router.route('/products/:productBarcode')
	.get((req, res) => {
		var productBarcode = req.params.productBarcode;


		var connection = mysql.createConnection(config);

		// Get productId
		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode],
			(error, results, field) => {
				if (error) throw res.status(404).json({
					status: 0,
					error: error
				});

				// If found product in the database then get data
				if (results.length >= 1) {
					var productId = results[0].productId
					connection.query(querys.products.getProduct, [productId], (error, results, fields) => {
						if (error)
							throw res.json({
								status: 0,
								error: error
							});

						if (results.length >= 1) {
							res.json({
								productId: results[0].productId,
								productBarcode: results[0].productBarcode,
								productName: results[0].productName,
								productBrand: results[0].productBrand,
								productManufacturer: results[0].productManufacturer,
								productSize: results[0].productSize,
								productStatus: results[0].productStatus
							});
						}
					});
				} else res.status(404).json({
					status: 0,
					error: 'This product is not in the database.'
				});


			})


	})
	.put((req, res) => {
		var productBarcode = req.params.productBarcode;
		var productBarcodeEdit = req.body.productBarcode;
		var productName = req.body.productName;
		var productBrand = req.body.productBrand;
		var productManufacturer = req.body.productManufacturer;
		var productSize = req.body.productSize;
		var productStatus = req.body.productStatus;

		var connection = mysql.createConnection(config);

		// TODO : fix algorithum 
		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode],
			(error, results, field) => {
				if (error)
					throw res.status(404).json({
						status: 0,
						error: error
					});


				if (results.length >= 1) {
					var productId = results[0].productId;
					var connection = mysql.createConnection(config);
					connection.query(querys.products.getProduct, [productId], (error, results, fields) => {
						if (error)
							throw res.status(404).json({
								status: 0,
								error: error
							});

						productBarcodeEdit = productBarcodeEdit || results[0].productBarcode;
						productName = productName || results[0].productName;
						productBrand = productBrand || results[0].productBrand;
						productManufacturer = productManufacturer || results[0].productManufacturer;
						productSize = productSize || results[0].productSize;
						productStatus = productStatus || results[0].productStatus;

						var connection = mysql.createConnection(config);

						connection.query(querys.products.update, [productBarcodeEdit, productName, productBrand, productManufacturer, productSize, productStatus, productId],
							(error, results, fields) => {
								if (error)
									throw res.status(404).json({
										status: 0,
										error: error
									});

								res.json({
									status: 1,
									affectedRows: results.affectedRows,
									error: null
								});
							})

					});

				} else res.status(404).json({
					status: 0,
					error: 'This product is not in the database'
				});
			})



	})
	.delete((req, res) => {
		var productBarcode = req.params.productBarcode;

		var connection = mysql.createConnection(config);
		// Get productId
		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode],
			(error, results, field) => {
				if (error) throw res.status(404).json({
					status: 0,
					error: error
				});

				// if found product in the database then delete 
				if (results.length >= 1) {
					var productId = results[0].productId;
					var connection = mysql.createConnection(config);
					connection.query(querys.products.delete, [productId],
						(error, results, field) => {
							if (error) throw res.status(404).json({
								status: 0,
								error: error
							});

							res.json({
								status: 1,
								affectedRows: results.affectedRows,
								error: null
							});
						}
					)
				} else {
					res.status(404).json({
						status: 0,
						error: 'This product is not in the database'
					});
				}
			})


	})

// Get product detail from store , Add product to store
router.route('/products/:productBarcode/stores/:storeId')
	// Get product detail from store
	.get((req, res) => {
		var productBarcode = req.params.productBarcode;
		var storeId = req.params.storeId;

		var connection = mysql.createConnection(config);

		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode],
			(error, results, fields) => {
				if (error)
					throw res.status(404).json({
						status: 0,
						error: error
					});
				if (results.length >= 1) {
					var productId = results[0].productId;
					var connection = mysql.createConnection(config);
					connection.query(
						querys.products.getProductDetailFromStore, [productId, storeId],
						(error, results, fields) => {
							if (error)
								throw res.status(404).json({
									status: 0,
									error: error
								});

							res.json({
								productId: results[0].productId,
								productBarcode: results[0].productBarcode,
								productName: results[0].productName,
								productBrand: results[0].productBrand,
								productManufacturer: results[0].productManufacturer,
								productSize: results[0].productSize,
								productPrice: results[0].productPrice,
								productQuantity: results[0].productQuantity,
								productMinimumQuantity: results[0].productMinimumQuantity,
							});
						}
					);

				} else res.status(404).json({
					status: 0,
					error: 'This product is not in the database.'
				});
			})


	})
	// Add product to store
	.post((req, res) => {
		//TODO : Validation
		var productBarcode = req.params.productBarcode;
		var storeId = req.params.storeId;
		var productCost = req.body.productCost;
		var productQuantity = req.body.productQuantity;
		var productPrice = req.body.productPrice;
		var productMinimumQuantity = req.body.productMinimumQuantity;

		var connection = mysql.createConnection(config);

		// Get productId
		connection.query(querys.products.isInTheDatabaseSpecific, [productBarcode],
			(error, results, fields) => {
				if (error) throw res.status(404).json({
					status: 0,
					error: error
				});

				if (results.length >= 1) {
					var productId = results[0].productId;
					var connection = mysql.createConnection(config);
					//Check if this product is already in the store (first time add)
					connection.query(querys.productInStores.isInTheDatabase, [productId, storeId], (error, results, fields) => {
						if (error)
							throw res.status(404).json({
								status: 0,
								error: error
							});
						//if not add to the store directly
						if (!(results[0].result >= 1)) {
							var connection = mysql.createConnection(config);
							connection.query(
								querys.productInStores.create, [productId, storeId, productQuantity, productPrice, productMinimumQuantity],
								(error, results, fields) => {
									if (error)
										throw res.status(404).json({
											status: 0,
											error: error
										});

									res.status(201).json({
										status: 1,
										error: null
									});
								}
							);
						} else {
							var connection = mysql.createConnection(config);
							// Else add to the product_logs table first 
							connection.query(
								querys.productLog.create, [productId, storeId, querys.functions.CURRENT_TIMESTAMP, productQuantity, productCost, productPrice],
								(error, results, fields) => {
									if (error)
										throw res.status(404).json({
											status: 0,
											error: error
										});
								}
							);

							// Then update to the product_in_stores table
							connection.query(
								querys.productInStores.updateStockIn, [productQuantity, productPrice, productMinimumQuantity, productId, storeId],
								(error, results, fields) => {
									if (error)
										throw res.status(404).json({
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

				} else res.status(404).json({
					status: 0,
					error: 'This product is not in the database.'
				});
			})


	});



//Create receipt
router.post('/stores/:storeId/receipts', (req, res) => {
	//TODO : Validation
	var storeId = req.params.storeId;
	var userId = req.body.userId;
	var receiptTotalPrice = req.body.receiptTotalPrice;
	var customerMoneyPaid = req.body.customerMoneyPaid;
	var receiptMoneyChange = req.body.receiptMoneyChange;
	var productDetail = req.body.productDetail;

	var connection = mysql.createConnection(config);

	// TODO : Validation
	// Update Stock
	for (var i = 0; i < productDetail.length; i++) {
		let saleQuantity = productDetail[i].saleQuantity;
		let productId = productDetail[i].productId;
		let isProductQuantityMoreThanSaleQuantity = true;

		// TODO : Change algorithum
		// Check product stock quantity
		connection.query(querys.productInStores.getStockQuantity, [productId, storeId],
			(error, results, fields) => {
				// TODO : FIX header error from send res more then 1 time (n loop)
				if (error)
					throw res.status(404).json({
						status: 0,
						error: error
					});
				if (results[0].product_quantity >= saleQuantity) {
					var connection = mysql.createConnection(config);
					// Update stock
					connection.query(
						querys.productInStores.updateStockOut, [saleQuantity, productId, storeId],
						(error, results, fields) => {
							// TODO : FIX header error from send res more then 1 time (n loop)
							if (error)
								throw res.status(404).json({
									status: 0,
									error: error
								});
						}
					);
				}
			});

		//TODO : Check if ProductQuantityMoreThanSaleQuantity if so break the loop
		// if (isProductQuantityMoreThanSaleQuantity === false) {
		// 	res.json({
		// 		status: 0,
		// 		error: 'Product quantity is less that sale quantity'
		// 	});
		// 	break;
		// }
	}

	// Create receipt
	connection.query(querys.receipt.create, [userId, storeId, querys.functions.CURRENT_TIMESTAMP, receiptTotalPrice, customerMoneyPaid, receiptMoneyChange],
		(error, results, fields) => {
			if (error)
				throw res.status(404).json({
					status: 0,
					error: error
				});

			// TODO : Change algorithum
			// create receipt detail
			var receiptId = results.insertId;
			for (var i = 0; i < productDetail.length; i++) {
				var connection = mysql.createConnection(config);

				connection.query(querys.receiptProductDetail.create, [receiptId, productDetail[i].productId, productDetail[i].saleQuantity, productDetail[i].salePrice, productDetail[i].saleTotalPrice],
					(error, results, fields) => {
						if (error) console.log(error);
						// TODO : FIX header error from send res more then 1 time (n loop)
						// if (error)
						// 	throw res.json({
						// 		status: 0,
						// 		error: error
						// 	});
					}
				);
			}

			res.status(201).json({
				status: 1,
				receiptId: receiptId,
				error: null
			});
		}
	);
});
module.exports = router;