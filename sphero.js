var sphero = function () {

    var self = this;

    var Cylon = require('cylon');
    var math = require('./math');
    var targetPosition = {x: 0, y: 0};
    var currentPosition = {x: 0, y: 0};
    var dataCallbacks = [];
    var started = false;
    self.setTarget = function (target) {
        targetPosition = target;
    };

    self.setPositionCallback = function (callback) {
        dataCallbacks.push(callback);
    };

    var cylon = Cylon.robot({
        connection: {name: 'sphero', adaptor: 'sphero', port: 'COM6'},
        device: {name: 'sphero', driver: 'sphero'},

        work: function (my) {

            var moveTo = function (target) {
                console.log('New target: ' + target);
                targetPosition = target;
            };
            my.sphero.detectCollisions();
            my.sphero.readLocator();
            my.sphero.configureLocator(1, 0, 0, 0);

            console.log("Connected!");

            var moveTowardTarget = function () {
                console.log(currentPosition);
                var polar = math.getPolar(targetPosition, currentPosition);
                var speed = Math.min((polar.distance * 25).toFixed(), 255);
                console.log({polar: polar, speed: speed});
                my.sphero.roll(speed, polar.theta);
            };

            my.sphero.on('data', function (data) {
                currentPosition = {x: data[0], y: data[1]};
                var callbackData = {
                    position: {x: data[0], y: data[1]},
                    velocity: {x: data[2], y: data[3], speed: data[4]}
                };
                console.log(callbackData);
                for (var i = 0; i < dataCallbacks.length; i++) {
                    dataCallbacks[i](callbackData);
                }
                moveTowardTarget();
            });
        }
    });


    self.start = function () {
        if (!started) {
            cylon.start();
            started = true;
        }
    }
};

module.exports = sphero;