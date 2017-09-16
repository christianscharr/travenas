var request = require('../viadi/ConnectionRequest');

var controller = {};

controller.getConnection = function (from, to) {
    var transformResponseData = function (data) {
        var transformed = {connections: []};
        for (var i = 0; i < data.connections.length; i++) {
            var inConn = data.connections[i];
            var outConn = {};
            outConn.from = inConn.from.location.name;
            outConn.to = inConn.to.location.name;
            outConn.depart = inConn.from.time;
            outConn.arrival = inConn.to.time;

            outConn.sections = [];
            for (var j = 0; j < inConn.sections.length; j++) {
                var inSec = inConn.sections[j];
                var outSec = {};

                outSec.fromStationId = inSec.from.location.stationId;
                outSec.toStationId = inSec.to.location.stationId;
                if (inSec.route) {
                    outSec.route = inSec.route.name + '|' + inSec.route.infoName + '|' + inSec.route.company;
                } else {
                    outSec.route = inSec.from.location.stationId + "|" + inSec.from.time + "|" + inSec.to.location.stationId + "|" + inSec.to.time;
                }
                outSec.load = 0;  // TODO

                outConn.sections.push(outSec);
            }

            outConn.setRank = inConn.duration; //TODO: only a workaround
            transformed.connections.push(outConn);
        }
        return transformed;
    };

    var promise = new Promise(function (resolve, reject) {
        request.perform(from, to).then(
            function (value) {
                var transformed = transformResponseData(value);
                resolve(transformed);
            }, function (reason) {
                resolve(reason);
            });
    });
    return promise;
};


module.exports = controller;