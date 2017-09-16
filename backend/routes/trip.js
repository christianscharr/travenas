var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();



/* GET users listing. */
router.post('/', function (req, res, next) {
    var userId = req.query.user;

});

module.exports = router;
