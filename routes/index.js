var express = require('express');
var router = express.Router();

// TODO : find a way to get server ip address
var serverAddress = 'http://150.95.26.138'

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/product', function(req, res, next) {
	res.render('product', {serverAddress : serverAddress});
});
module.exports = router;
