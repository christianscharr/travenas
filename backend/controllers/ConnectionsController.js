var request = require('../viadi/ConnectionRequest');

var controller = {};

controller.getConnection = function (from, to) {
    return request.perform(from, to);
};


module.exports = controller;