var Cylon = require('cylon');
var math = require('./math');
var _ = require('underscore');

var sphero = function () {

    var self = {};

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
    self.moveTo = function (target) {
        targetPosition = target;
    };

    var cylon = Cylon.robot({
        connection: {name: 'sphero', adaptor: 'sphero', port: 'COM6'},
        device: {name: 'sphero', driver: 'sphero'},

        work: function (my) {

            my.sphero.detectCollisions();
            my.sphero.readLocator();
            my.sphero.configureLocator(1, 0, 0, 0);

            var moveTowardTarget = function () {
                var polar = math.getPolar(targetPosition, currentPosition);
                var speed = Math.min((polar.r * 5).toFixed(), 255);
                console.log({polar:polar,speed:speed});
                my.sphero.roll(speed, polar.theta);
            };

            my.sphero.on('data', function (data) {
                currentPosition = {x: data[0], y: data[1]};
                var callbackData = {
                    position: {x: data[0], y: data[1]},
                    velocity: {x: data[2], y: data[3], speed: data[4]}
                };
                _.each(dataCallbacks, function (callback) {
                    callback(callbackData);
                });

                moveTowardTarget();
            });
        }
    });


    self.start = function () {
        if (!started) {
            cylon.start();
            started = true;
        }
    };
    return self;
};

module.exports = sphero();