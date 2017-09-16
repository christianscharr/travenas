var controller = require('../controllers/ConnectionsController');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  controller.getConnection(req.query.from, req.query.to).then(function (value) { res.send(value) });
});



module.exports = router;
