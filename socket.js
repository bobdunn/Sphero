var _ = require('underscore');
module.exports = function (http) {
    var self = this;
    var io = require('socket.io')(http);
    var subscriptions = [];

    io.on('connection', function (socket) {
        self.subscribe = function (topic, callback) {
            socket.on(topic, callback);
        };
        connected = true;
        _.each(subscriptions, function (sub) {
            self.subscribe(sub.topic, sub.callback);
        });
        self.sendMessage = function (message) {
            io.emit('message', message);
        };
    });
    self.sendMessage=function(){};
    self.subscribe = function (topic, callback) {
        console.log('topic subscribed: ' + topic);
        subscriptions.push({topic: topic, callback: callback});
    };
    return self;
};