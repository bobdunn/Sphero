var sphero = require('./sphero/sphero');


var debug = require('debug')('website');
var site = require('./website/app');
site.set('port', process.env.PORT || 3000);

var server = site.listen(site.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var socket = require('./socket')(server);
socket.subscribe('setTarget', function (message) {
    console.log(message);
    sphero.moveTo({x: message.x * 100, y: message.y * 100});
});

sphero.setPositionCallback(function (data) {
    site.setPosition(data);
    socket.sendMessage({position: data});
});
sphero.start();
