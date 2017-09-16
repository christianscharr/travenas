var express = require('express');
var StationsController = require('../controllers/StationsController');
var tripending = express.Router();

tripending.get('/', function (req, res) {
    const stationId = req.query.stationId;
    const userId = req.query.userId;

    StationsController.visitStation(stationId, userId).then(function (result) {
        console.log('result in response: ', result);
        res.send(result);
    });

});

module.exports = tripending;
