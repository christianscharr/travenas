var express = require('express');
var SendBird = require('sendbird');
var Promise = require('promise');
//var Map = require('Map');
var chat = express.Router();

var chatRooms = new Map();
const APP_ID = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
const CHAT_ROOM_ROUTE = 'Route_';
const CHAT_ROOM_ROUTE_URL = 'RouteUrl';
const CHAT_ROOM_STATION = 'Station_';
const CHAT_ROOM_STATION_URL = 'StationUrl';

const sb = new SendBird({'appId': APP_ID});

chat.get('/', function (req, res) {


    const routeId = req.query.routeId;
    const stationId = req.query.stationId;
    const CHAT_ROOM_NAME_ROUTE = CHAT_ROOM_ROUTE + routeId;
    const CHAT_ROOM_NAME_STATION = CHAT_ROOM_STATION + stationId;
    const result = {};

    console.log('current chat rooms: ', chatRooms.keys(), chatRooms.values(), result);
    sb.connect('admin', (user, error) => {
        if (error) {
            console.log('error while connection sendbird ', error);
        } else {
            console.log('sendbird is connected by admin from server');
            if (!isChatRoomExisted(CHAT_ROOM_NAME_ROUTE)) {
                createChannelWithName(CHAT_ROOM_NAME_ROUTE,
                    routeId).then((value) => {

                    console.log('url of createdChannel ' + CHAT_ROOM_ROUTE + ' ', value);
                    result[CHAT_ROOM_ROUTE_URL] = value;
                    console.log('result after first step : ', result);
                    chatRooms.set(CHAT_ROOM_NAME_ROUTE, value);
                    //res.send(result);
                    if (!isChatRoomExisted(CHAT_ROOM_NAME_STATION)) {
                        console.log('check...');
                        createChannelWithName(CHAT_ROOM_NAME_STATION, stationId).then((value) => {
                            console.log('check 2...');
                            chatRooms.set(CHAT_ROOM_NAME_STATION, value);
                            result[CHAT_ROOM_STATION_URL] = value;
                            console.log('result after second step : ', result);
                            res.send(result);
                        });
                    } else {
                        console.log(' CHAT_ROOM_NAME_STATION is not there ');
                        result[CHAT_ROOM_STATION_URL] = chatRooms.get(CHAT_ROOM_NAME_STATION);
                        res.send(result);
                    }
                });
            } else {
                result[CHAT_ROOM_ROUTE_URL] = chatRooms.get(CHAT_ROOM_NAME_ROUTE);
                console.log(' CHAT_ROOM_NAME_ROUTE exists ', chatRooms.get(CHAT_ROOM_NAME_ROUTE) );
                //res.send(result);
                if (!isChatRoomExisted(CHAT_ROOM_NAME_STATION)) {
                    console.log('check...');
                    createChannelWithName(CHAT_ROOM_NAME_STATION, stationId).then((value) => {
                        console.log('check 2...');
                        chatRooms.set(CHAT_ROOM_NAME_STATION, value);
                        result[CHAT_ROOM_STATION_URL] = value;
                        console.log('result after second step : ', result);
                        res.send(result);
                    });
                } else {
                    console.log(' CHAT_ROOM_NAME_STATION is not there ');
                    result[CHAT_ROOM_STATION_URL] = chatRooms.get(CHAT_ROOM_NAME_STATION);
                    res.send(result);
                }
            }


            console.log('result in response: ', result);
            //res.send(result);
        }

    });

});

function isChatRoomExisted(chatRoomName) {
    console.log('isChatRoomExisted', chatRoomName, chatRooms.has(chatRoomName));
    return chatRooms.has(chatRoomName);
}

function createChannelWithName(chatRoomName, stationId) {

    const promise = new Promise((resolve, reject) => {
        sb.OpenChannel.createChannel(chatRoomName,
            CHAT_ROOM_STATION_URL + '_' + stationId,
            'data...', (createdChannel, error) => {
                if (error) {
                    console.log('what happend ', error);
                    reject(error);

                } else {
                    console.log('successful  ');
                    resolve(createdChannel.url);
                }

            });
    });
    return promise;
}

module.exports = chat;
