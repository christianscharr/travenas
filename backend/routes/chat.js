var express = require('express');
var SendBird = require('sendbird');
//var Map = require('Map');
var chat = express.Router();

var chatRooms = new Map();
const APP_ID = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
const CHAT_ROOM_ROUTE = 'ChatRoomRoute_';
const CHAT_ROOM_ROUTE_URL = 'ChatRoomRouteUrl';
const CHAT_ROOM_STATION = 'ChatRoomStation_';
const CHAT_ROOM_STATION_URL = 'ChatRoomStationUrl';

const sb = new SendBird({'appId': APP_ID});

chat.get('/', function (req, res) {


    const routeId = req.query.routeId;
    const stationId = req.query.stationId;
    const result = {};

    sb.connect('admin', (user, error) => {
        if(error) {
            console.log('error while connection sendbird ', error);
        } else {
            console.log('sendbird is connected by admin from server');
            sb.OpenChannel.createChannel(CHAT_ROOM_ROUTE + routeId,
                                        CHAT_ROOM_ROUTE_URL + '_' + routeId,
                                        'data...', (createdChannel, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                console.log('url of createdChannel ' + CHAT_ROOM_ROUTE + ' ', createdChannel.url);
                result[CHAT_ROOM_ROUTE_URL] = createdChannel.url;
                chatRooms.set()
                createChannelForStation(stationId, res, result);
            });
        }

    });

});

function createChannelForStation(stationId, res, result) {
    sb.OpenChannel.createChannel(CHAT_ROOM_STATION+ stationId,
                                CHAT_ROOM_STATION_URL + '_'+ stationId,
                                'data...', (createdChannel, error) => {
        if (error) {
            console.error(error);
            return;
        }
        result[CHAT_ROOM_STATION_URL] = createdChannel.url;
        res.send(result);

        // onCreated
        console.log('createdChannel', createdChannel);
    });
}

module.exports = chat;
