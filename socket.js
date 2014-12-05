module.exports = function (http) {
    var self = this;
    self.sendMessage=function(){};
    var io = require('socket.io')(http);


    io.on('connection', function (socket) {
        console.log('a user connected');
    });

    io.on('connection', function (socket) {
        self.sendMessage = function (message) {
            io.emit('message', message);
        };
    });
    return self;
};