module.exports = function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('room', function (room) {
        console.log('user asked for room: ', room);
        socket.join(room.room);
    });
};