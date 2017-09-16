var express = require('express');
var mysql = require('mysql');
var config = require('../config');
var router = express.Router();


router.post('/', function (req, res, next) {
    var userId = req.query.user;
    var conn = req.body;

    var sqlConnection = mysql.createConnection(config.mysqldb);
    sqlConnection.connect(function (err) {
        if (err) throw err;
        console.log('You are now connected...');

        sqlConnection.query('INSERT INTO connections (user, fromDest, toDest, depart, arrival) VALUES (?, ?, ?, ?, ?)',
            [userId, conn.from, conn.to, conn.depart, conn.arrival], function (err, result) {
            if (err) throw err;
            console.log(result);
            var connectionId = result.insertId;
            for (var i=0; i<conn.sections.length; i++) {
                var section = conn.sections[0];
                sqlConnection.query('INSERT INTO sections (connection, fromStation, toStation, route) VALUES (?, ?, ?, ?)',
                    [connectionId, section.fromStationId, section.toStationId, section.route], function (err, result) {
                        if (err) throw err;
                        console.log(result);
                    });
            }
            res.send({connectionId: connectionId});
        });

    });

});

module.exports = router;
