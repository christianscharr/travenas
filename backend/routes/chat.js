var express = require('express');
var SendBird = require('sendbird');
var chat = express.Router();

var chatRooms = [];
const APP_ID = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
const CHAT_ROOM_ROUTE = 'ChatRoomRoute_';
const CHAT_ROOM_ROUTE_URL = 'ChatRoomRouteUrl_';
const CHAT_ROOM_STATION = 'ChatRoomStation_';
const CHAT_ROOM_STATION_URL = 'ChatRoomStationUrl_';

const sb = new SendBird({'appId': APP_ID});

chat.get('/', function (req, res) {

    const routeId = req.query.routeId;
    const stationId = req.query.stationId;

    sb.connect('admin', (user, error) => {
        if(error) {
            console.log('error while connection sendbird ', error);
        } else {
            console.log('sendbird is connected by admin from server');
            sb.OpenChannel.createChannel(CHAT_ROOM_ROUTE + routeId,
                                        CHAT_ROOM_ROUTE_URL + routeId,
                                        'data...', (createdChannel, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                createChannelForStation(stationId, res);
            });
        }

    });

});

function createChannelForStation(stationId, res) {
    sb.OpenChannel.createChannel(CHAT_ROOM_STATION+ stationId,
                                CHAT_ROOM_STATION_URL+ stationId,
                                'data...', (createdChannel, error) => {
        if (error) {
            console.error(error);
            return;
        }
        res.send('ok');

        // onCreated
        console.log('createdChannel', createdChannel);
    });
}

module.exports = chat;
