var sphero = require('./sphero/sphero');


var debug = require('debug')('website');
var site = require('./website/app');
site.set('port', process.env.PORT || 3000);

var server = site.listen(site.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var socket = require('./socket')(server);

sphero.setPositionCallback(function (data) {
    console.log(data.position.x);
    site.setPosition(data);
    socket.sendMessage({position: data});
});
sphero.start();
