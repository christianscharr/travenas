module.exports = function (socket) {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('room', function (msg) {
        console.log('user asked for room: ', msg);
        socket.join(msg.room);

        socket.broadcast.to(msg.room).emit('message', {
            'txt' : 'user ' + msg.userId + " joined the room"
        });
    });

    socket.on('message', function (msg) {
        console.log('[' + msg.userId + '] wrote a message "' + msg.txt + '"');
    });
};