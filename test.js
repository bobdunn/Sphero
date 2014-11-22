var Cylon = require('cylon');
var steer = require('./steer.js');
var tweeter = require('./sphero-twitter.js');

var speedDivisor = 2;


var handleMotion = function(pos, robot){
    var heading = Math.floor(
            (Math.atan2(pos.x,-pos.y) * 180 / Math.PI) + 360) % 360;
    var speed= Math.floor(Math.sqrt(pos.x *pos.x + pos.y * pos.y)/speedDivisor);
    var distance = Math.sqrt(pos.x*pos.x + pos.y*pos.y + pos.z*pos.z);
    console.log({heading:heading,speed:speed,distance:distance});
    if (speed < 8 || distance > 400)
      robot.stop();
    else
      robot.roll(speed, heading);
};

var calibrateAndStartReading = function(robot) {
    robot.roll(100, 0)
    setTimeout(function() {
        robot.stop();
        steer.motion(function(pos){
            handleMotion(pos,robot);
        });
    }, 8*1000);
};

var direction = 0;
var speed = 255;
Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: 'COM5' },
  device: {name: 'sphero', driver: 'sphero'},
  work: function(my) {
	my.sphero.detectCollisions();

	my.sphero.on('collision', function(){
		console.log('bump');
        tweeter.tweet('Ouch!! Cheating detected at ' + new Date())
	});

     calibrateAndStartReading(my.sphero);

  }
}).start();