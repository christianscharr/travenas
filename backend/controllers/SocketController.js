let app = require('../app');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let randomColor = require("randomcolor");
const util = require('util');
let fs = require('fs');

const NodeCache = require("node-cache");
const gameCache = new NodeCache();

let socketController = function (socket) {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('room', function (msg) {
        const fileName = "./tmp/" + msg.room.replace(/[^a-zA-Z0-9\-_ ]/g, "") + ".json";
        const room = io.sockets.adapter.rooms[msg.room];

        if (util.isNullOrUndefined(room) || room.length < 1) {
            if (msg.room.toLowerCase().indexOf("station") === 0) {
                return;
            }

            console.log("creating gamefield...");

            let gameField = [];

            for (let x = 0; x < 6; x++) {
                let row = [];

                for (let y = 0; y < 6; y++) {
                    row[y] = {
                        win: ((Math.random() * 100) < 10),
                        color: randomColor(),
                        owner: null
                    };
                }

                gameField.push(row);
            }

            fs.writeFile(fileName, JSON.stringify(gameField), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log(fileName + " saved!");

                socket.join(msg.room);

                io.sockets.in(msg.room).emit('game', {
                    'gameField': gameField
                });
            });
        } else {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    return console.log(err);
                }

                console.log(fileName + " loaded!");

                socket.join(msg.room);

                io.sockets.in(msg.room).emit('game', {
                    'gameField': JSON.parse(data)
                });
            });
        }
    });

    socket.on('game', function (msg) {
        const fileName = "./tmp/" + msg.room.replace(/[^a-zA-Z0-9\-_ ]/g, "") + ".json";

        fs.readFile(fileName, function (err, data) {
            if (err) {
                return console.log(err);
            }

            cachedGame = JSON.parse(data);

            console.log(fileName + " loaded!");

            if (!util.isNullOrUndefined(msg.flip)) {
                console.log("got valid game action");
                const field = cachedGame[msg.flip.x][msg.flip.y];

                if (util.isNullOrUndefined(field.owner) || field.owner.trim().length < 1) {
                    cachedGame[msg.flip.x][msg.flip.y].owner = msg.userId;

                    fs.writeFile(fileName, JSON.stringify(cachedGame), function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log(fileName + " saved!");

                        io.sockets.in(msg.room).emit('game', {
                            'gameField': cachedGame,
                            'win': (field.win === true),
                            'winner': (field.win === true) ? msg.userId : null
                        });
                    });
                }
            }
        });
    });

    socket.on('message', function (msg) {
        console.log('[' + msg.userId + '] wrote a message "' + msg.txt + '"');
        io.sockets.in(msg.room).emit('message', msg);
    });
};

io.on('connection', socketController);

module.exports = {
    'app': app,
    'http': http
};