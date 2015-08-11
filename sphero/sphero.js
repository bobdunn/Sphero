var Cylon = require('cylon');
var math = require('./math');
var locator = require('./locator');
var _ = require('underscore');



var targetPosition = {
  x: 0,
  y: 0
};
var currentPosition = {
  x: 0,
  y: 0
};
var dataCallbacks = [];
var started = false;

var self = {
  setTarget: function(target) {
    targetPosition = target;
  },
  setPositionCallback: function(callback) {
    dataCallbacks.push(callback);
  },
  moveTo: function(target) {
    targetPosition = target;
  },
  start: function() {
    if (!started) {
      cylon.start();
      started = true;
    }
  }
};

var moveTowardTarget = function(sphero) {
  var polar = math.getPolar(targetPosition, currentPosition);
  var speed = Math.min((polar.r * 5).toFixed(), 255);
  sphero.roll(speed, polar.theta);
};

var handleData = function(data) {
  currentPosition = {
    x: data[0],
    y: data[1]
  };
  var callbackData = {
    position: currentPosition,
    velocity: {
      x: data[2],
      y: data[3],
      speed: data[4]
    }
  };
  _.each(dataCallbacks, function(callback) {
    callback(callbackData);
  });

  moveTowardTarget(my.sphero);
}


var cylon = Cylon.robot({
  connection: {
    name: 'sphero',
    adaptor: 'sphero',
    port: process.env.SPHERO_COM_PORT
  },
  device: {
    name: 'sphero',
    driver: 'sphero'
  },

  work: function(my) {
    locator(my.sphero);
    my.sphero.readLocator();
    my.sphero.configureLocator(1, 0, 0, 0);

    my.sphero.on('data', function(data) {
      handleData(data);
    });
  }
});

module.exports = self
