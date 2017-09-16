var mysql = require('mysql');
var config = require('../config');

var controller = {};

controller.visitStation = function (stationId, userId) {


    var promise = new Promise(function (resolve, reject) {
        var sqlConnection = mysql.createConnection(config.mysqldb);
        sqlConnection.connect(function (err) {
            if (err) throw err;
            console.log('You are now connected...');

            sqlConnection.query('SELECT * FROM connections WHERE finished=false AND endStation=? AND user=?',
                [stationId, userId], function (err, results) {
                if (err) throw err;
                console.log("results " + results);
                if (results.length == 0) {
                    resolve({status: "ongoing"});
                    return;
                }
                //var endStation = results[0].endStation;
                var rank = results[0].ranking;
                //var userId = results[0].user;
                sqlConnection.query('UPDATE connections SET finished=true WHERE user=? AND endStation=?',
                    [userId, stationId], function (err, result) {
                    if (err) throw err;
                    console.log("result " + result);
                    sqlConnection.query('SELECT * FROM score WHERE user=?',
                        [userId], function (err, results) {
                            if (err) throw err;
                            console.log("results " + results);
                            if (results.length > 0){
                                var score = results[0].score;
                                var newScore = score + rank;

                                sqlConnection.query('UPDATE score SET score=? WHERE user=?',
                                    [newScore, userId], function (err, result) {
                                        if (err) throw err;
                                        console.log("result " + result);
                                        resolve({status: "finished", score: newScore});
                                    });
                            } else {
                                sqlConnection.query('INSERT INTO score (user, score) VALUES (?, ?)',
                                    [userId, rank], function (err, result) {
                                        if (err) throw err;
                                        console.log(result);
                                        resolve({status: "finished", score: rank});
                                    });
                            }

                    });
                });
            });
        });
    });
    return promise;
};


module.exports = controller;