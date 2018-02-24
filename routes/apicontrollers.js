var express = require('express');
var mysql = require('mysql');
var validator = require('express-joi-validation')({});
var config = require('../config/database');
var router = express.Router();


// Login
router.post('/login1', function (req, res) {
  var validData = joi.validate(req.body,
    userSchema,
    {
      allowUnknown: false,
      abortEarly: false
    });
  if (validData.error) {
    res.status(400).json(validData.error.toString());
  } else {
    var connection = mysql.createConnection(config);

    connection.query('select count(*) as result from users where email = ? and password = ?',
      [validData.value.email, validData.value.password],
      function (error, results, fields) {
        if (error) throw res.send(error);
        results[0].result === 1 ? res.json(1) : res.status(400).json(0);
      });

    connection.end();
  }
});

router.post('/login2',
  validator.body(require('../validations/schema-login'),
    { joi: { allowUnknown: false, abortEarly: false } }),
  function (req, res) {

    var connection = mysql.createConnection(config);

    connection.query('select count(*) as result from users where email = ? and password = ?',
      [req.body.email, req.body.password],
      function (error, results, fields) {
        if (error) throw res.send(error);
        results[0].result === 1 ? res.json(1) : res.status(400).json(0);
      });

    connection.end();
  }
);






























////////////////////////////////////////////////////////////////////////

// Register
router.post('/register', function (req, res) {
  var userData = {
    email: req.body.email,
    password: req.body.password
  };
  var connection = mysql.createConnection(config);

  connection.query('select count(*) as result from users where email = ? and password = ?',
    [userData.email, userData.password],
    function (error, results, fields) {
      if (error) throw res.send(error);
      if (!(results[0].result >= 1)) {
        var connection = mysql.createConnection(config);
        connection.query('insert into users (email, password) values (?, ?)',
          [userData.email, userData.password],
          function (error, results, fields) {
            if (error) throw res.send(error);
            res.send(`success user_id : ${results.insertId}`);
          });
      } else {
        res.send('This users is already in our database');
      }
    });


  connection.end();

});

// Get all product from the database
router.get('/product', (req, res) => {
  var connection = mysql.createConnection(config);

  connection.query('select * from products', (error, results, fields) => {
    if (error) throw res.send(error);
    results.length > 0 ? res.json(results) : res.json(0)
  })
  connection.end();
})


// Get specific product from the database
router.get('/product/:productId', (req, res) => {
  var productId = req.params.productId;
  var connection = mysql.createConnection(config);

  connection.query('select * from products where product_id = ?', productId, (error, results, fields) => {
    if (error) throw res.send(error);
    results.length > 0 ? res.json(results) : res.json(0);
  });

  connection.end();
});

// Get all product from the specific store
router.get('/product/store/:storeId', (req, res) => {
  var storeId = req.params.storeId;

  var connection = mysql.createConnection(config);

  connection.query('select * from products join product_in_stores on products.product_id = product_in_stores.product_id where store_id = ?',
    storeId,
    (error, results, fields) => {
      if (error) throw res.send(error);
      results.length > 0 ? res.json(results) : res.json(0);
    });
  connection.end();
});

// Get product from the specific store
router.get('/product/:productId/store/:storeId', (req, res) => {
  var storeId = req.params.storeId;
  var productId = req.params.productId;
  var connection = mysql.createConnection(config);

  connection.query('select * from products join product_in_stores on products.product_id = product_in_stores.product_id where store_id = ? and products.product_id = ?',
    [storeId, productId],
    (error, results, fields) => {
      if (error) throw res.send(error);
      results.length > 0 ? res.json(results) : res.json(0);
    });
  connection.end();
});


// Add product to the database
router.post('/product/add/:productName', (req, res) => {
  var productName = req.params.productName;
  var connection = mysql.createConnection(config);

  connection.query('select count(*) as result from products where product_name = ?',
    productName,
    (error, results, fields) => {
      if (error) throw res.send(error);
      if (!(results[0].result >= 1)) {
        var connection = mysql.createConnection(config);
        connection.query('insert into products (product_name) values (?)',
          productName,
          (error, results, fields) => {
            if (error) throw res.send(error);
            res.send(`success product_id : ${results.insertId}`);
          })
      } else {
        res.send(`${productName} is already in the database`);
      }
    })

  connection.end();
});

// Add store to the database
router.post('/store/add/:storeName', (req, res) => {
  var storeName = req.params.storeName;
  var connection = mysql.createConnection(config);

  connection.query('select count(*) as result from stores where store_name = ?',
    storeName,
    (error, results, fields) => {
      if (error) throw res.send(error);
      if (!(results[0].result >= 1)) {
        var connection = mysql.createConnection(config);
        connection.query('insert into stores (store_name) values (?)',
          storeName,
          (error, results, fields) => {
            if (error) throw res.send(error);
            res.send(`success store_id : ${results.insertId}`);
          })
      } else {
        res.send(`${storeName} is already in the database`);
      }
    })
})

router.post('', (req, res) => {


})


module.exports = router;
