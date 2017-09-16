var express = require('express');
var mysql = require('mysql');
var config = require('../config');
var Rx = require('rxjs');
var router = express.Router();

router.post('/', function (req, res, next) {
    var bodyData = req.body;
    var sqlConnection = mysql.createConnection(config.mysqldb);

    sqlConnection.connect(function (err) {
        if (err) {
            console.log('api/trip get request: ', err);
            throw err;
        }
        console.log('You are now connected...');

        var endStationId = bodyData.sections[bodyData.sections.length-1].toStationId;

        sqlConnection.query('INSERT INTO connections (user, fromDest, toDest, depart, arrival, endStation, ranking) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [bodyData.userId, bodyData.from, bodyData.to, bodyData.depart, bodyData.arrival, endStationId, bodyData.ranking], function (err, result) {
            if (err) throw err;
            var connectionId = result.insertId;

            Rx.Observable.from(bodyData.sections)
                .mergeMap(section => {
                    return Rx.Observable.create((obs) => {
                        sqlConnection.query('INSERT INTO sections (connection, fromStation, toStation, route) VALUES (?, ?, ?, ?)',
                            [connectionId, section.fromStationId, section.toStationId, section.route], function (err, result) {
                            if (err) obs.error(err);
                            obs.next(true);
                            obs.complete();
                        });
                    });
                })
                .subscribe(() => {
                    console.log('Section geschrieben');
                }, (err) => {
                    console.error(err);
                }, () => {
                    res.send({connectionId: connectionId});
                });
        });

    });
});

router.post('/identify', function (req, res, next) {
    var dataBody = req.body;
    var sqlConnection = mysql.createConnection(config.mysqldb);

    sqlConnection.connect(function (err) {
        if (err) throw err;
        console.log('MySQL-Connection successfully established...');

        sqlConnection.query('SELECT s.route FROM connections c, sections s' +
            ' WHERE c.connectionid = s.connection AND c.user = ? AND (s.fromStation = ? OR s.toStation = ?) AND c.depart <= ? AND c.arrival >= ?',
            [dataBody.userId, dataBody.stationId, dataBody.stationId, dataBody.time, dataBody.time], function (err, result) {
            if (err) throw err;

            res.send(result);
        });
    });
});

module.exports = router;
