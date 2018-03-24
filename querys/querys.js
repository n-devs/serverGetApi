module.exports = {
	functions: {
		CURRENT_TIMESTAMP: {
			toSqlString: function () {
				return 'CURRENT_TIMESTAMP()';
			}
		}
	},
	users: {
		isInTheDatabase: 'SELECT user_id FROM users WHERE email = ? AND password = ?',
		create: 'INSERT INTO users (name, birthday, gender, phonenumber, email, password) VALUES (?, ?, ?, ?, ?, ?)',

		getUserStoreList: 'SELECT uis.store_id AS storeId, uis.user_status AS userStatus FROM users JOIN user_in_stores as uis ON users.user_id = uis.user_id WHERE users.user_id = ?'
	},
	stores: {
		isInTheDatabaseSpecificName: 'SELECT store_id FROM stores WHERE store_name = ?',

		isInTheDatabaseSpecificId: 'SELECT store_id FROM stores WHERE store_id = ?',

		isInTheDatabase: 'SELECT store_id FROM stores',

		create: 'INSERT INTO stores (store_name, store_address, store_sub_district, store_district, store_province, store_postal_code) VALUES (?, ?, ?, ?, ?, ?)',

		getStores: 'SELECT users.user_id AS userId, users.name AS storeOwnerName, stores.store_id AS storeId, stores.store_name AS storeName, stores.store_address AS storeAddress, stores.store_sub_district AS storeSubDistrict, stores.store_district AS storeDistrict, stores.store_province AS storeProvince, stores.store_postal_code AS storePostalCode' +
			' FROM stores JOIN user_in_stores uis ON stores.store_id = uis.store_id JOIN users ON uis.user_id = users.user_id' +
			' WHERE uis.user_status = 1' +
			' ORDER BY uis.user_id',

		// TODO : for /apis/users/stores
		getStoresSpecific: '',

		getStore: 'SELECT store_id AS storeId, store_name AS storeName, store_address AS storeAddress, store_sub_district AS storeSubDistrict, store_district AS storeDistrict, store_province AS storeProvince, store_postal_code AS storePostalCode' +
			' FROM stores' +
			' WHERE store_id = ?'
	},

	userInStores: {
		create: 'INSERT INTO user_in_stores (user_id, store_id, user_status) VALUES (?, ?, ?)',

		getUserInStore: 'SELECT uis.user_id AS userId, users.name AS userName, uis.user_status AS userStatus' +
			' FROM user_in_stores uis JOIN users on uis.user_id = users.user_id' +
			' WHERE store_id = ?'
	},

	products: {
		isInTheDatabaseSpecific: 'SELECT product_id AS productId FROM products WHERE product_barcode = ?',

		isInTheDatabase: 'SELECT product_id AS productId FROM products',

		getProductDetailFromStore: 'SELECT pd.product_id AS productId, product_barcode AS productBarcode, pd.product_name AS productName, pd.product_brand AS productBrand, product_manufacturer AS productManufacturer, product_size AS productSize, pis.product_price AS productPrice, pis.product_quantity AS productQuantity, product_minimum_quantity AS productMinimumQuantity FROM products as pd JOIN product_in_stores as pis ON pd.product_id = pis.product_id WHERE pd.product_id = ? AND pis.store_id = ? ',

		getProduct: 'SELECT product_id AS productId, product_barcode AS productBarcode, product_name AS productName, product_brand AS productBrand, product_manufacturer AS productManufacturer, product_size AS productSize, product_status AS productStatus FROM products WHERE product_Id = ?',

		getProducts: 'SELECT product_id AS productId, product_barcode AS productBarcode, product_name AS productName, product_brand AS productBrand, product_manufacturer AS productManufacturer, product_size AS productSize, product_status AS productStatus FROM products WHERE product_status != 0',

		create: 'INSERT INTO products (product_barcode, product_name, product_brand, product_manufacturer, product_size, product_status) VALUES (?, ?, ?, ?, ?, ?)',

		delete: 'UPDATE products SET product_status = 0 WHERE product_id = ?',

		update: 'UPDATE products SET product_barcode = ?, product_name = ?, product_brand = ?, product_manufacturer = ?, product_size = ?, product_status = ? WHERE product_id = ?'

	},

	productInStores: {
		isInTheDatabase: 'SELECT count(*) as result FROM product_in_stores WHERE product_id = ? AND store_id = ?',
		create: 'INSERT INTO product_in_stores (product_id, store_id, product_quantity, product_price, product_minimum_quantity) VALUES (?, ?, ?, ?, ?)',

		updateStockIn: 'UPDATE product_in_stores SET product_quantity = product_quantity + ?, product_price = ?, product_minimum_quantity = ? WHERE product_id = ? AND store_id = ?',
		updateStockOut: 'UPDATE product_in_stores SET product_quantity = product_quantity - ? WHERE product_id = ? AND store_id = ?',
		getStockQuantity: 'SELECT product_quantity FROM product_in_stores WHERE product_id = ? AND store_id = ?'
	},

	productLog: {
		create: 'INSERT INTO product_logs (product_id, store_id, product_log_date, product_log_quantity, product_log_cost, product_log_price) VALUES (?, ?, ?, ?, ?, ?)'
	},

	receipt: {
		create: 'INSERT INTO receipts (user_id, store_id, receipt_date, receipt_total_price,customer_money_paid ,receipt_money_change) VALUES (?, ?, ?, ?, ?, ?)'
	},

	receiptProductDetail: {
		create: 'INSERT INTO receipt_product_details (receipt_id, product_id, receipt_product_sale_quantity, receipt_product_sale_price, receipt_product_total_price) VALUES (?, ?, ?, ?, ?)'
	}
};