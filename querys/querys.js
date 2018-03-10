module.exports = {
	functions: {
		CURRENT_TIMESTAMP: {
			toSqlString: function() {
				return 'CURRENT_TIMESTAMP()';
			}
		}
	},
	users: {
		isInTheDatabase: 'SELECT user_id FROM users WHERE email = ? AND password = ?',
		create: 'INSERT INTO users (name, birthday, gender, phonenumber, email, password) VALUES (?, ?, ?, ?, ?, ?)',

		getUserStoreList:
			'SELECT uis.store_id, uis.user_status FROM users JOIN user_in_stores as uis ON users.user_id = uis.user_id WHERE users.user_id = ?'
	},
	stores: {
		create:
			'INSERT INTO stores (store_name, store_address, store_sub_district, store_district, store_province, store_postalcode) VALUES (?, ?, ?, ?, ?, ?)'
	},

	userInStores: {
		create: 'INSERT INTO user_in_stores (user_id, store_id, user_status) VALUES (?, ?, ?)'
	},

	products: {
		isInTheDatabase: 'SELECT count(*) as result FROM products WHERE product_barcode = ? AND product_brand = ?',

		get:
			'SELECT pd.product_id, pd.product_name, pd.product_brand, pis.product_price FROM products as pd JOIN product_in_stores as pis ON pd.product_id = pis.product_id WHERE pd.product_barcode = ? AND pis.store_id = ? ',

		create:
			'INSERT INTO products (product_barcode, product_name, product_brand, product_manufacturer, product_size, product_status) VALUES (?, ?, ?, ?, ?, ?)'
	},

	productInStores: {
		isInTheDatabase: 'SELECT count(*) as result FROM product_in_stores WHERE product_id = ?AND store_id = ?',
		create:
			'INSERT INTO product_in_stores (product_id, store_id, product_quantity, product_price, product_minimum_quantity) VALUES (?, ?, ?, ?, ?)',

		updateStockIn:
			'UPDATE product_in_stores SET product_quantity = product_quantity + ?, product_price = ?, product_minimum_quantity = ? WHERE product_id = ? AND store_id = ?',
		updateStockOut:
			'UPDATE product_in_stores SET product_quantity = product_quantity - ? WHERE product_id = ? AND store_id = ?',
		getStockQuantity: 'SELECT product_quantity FROM product_in_stores WHERE product_id = ? AND store_id = ?'
	},

	productLog: {
		create:
			'INSERT INTO product_logs (product_id, store_id, product_log_date, product_log_quantity, product_log_cost, product_log_price) VALUES (?, ?, ?, ?, ?, ?)'
	},

	receipt: {
		create:
			'INSERT INTO receipts (user_id, store_id, receipt_date, receipt_total_price,customer_money_paid ,receipt_money_change) VALUES (?, ?, ?, ?, ?, ?)'
	},

	receiptProductDetail: {
		create:
			'INSERT INTO receipt_product_details (receipt_id, product_id, receipt_product_sale_quantity, receipt_product_sale_price, receipt_product_total_price) VALUES (?, ?, ?, ?, ?)'
	}
};
