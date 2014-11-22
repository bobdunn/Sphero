/**
 * Created by Bob on 10/7/2014.
 */
var steer = require('./steer.js');
var maxAngle = 180;
var speedDivisor = 5;

var handleMotion = function(pos){
    var heading = Math.floor(
            (Math.atan2(pos.x,-pos.y) * 180 / Math.PI) + 360) % 360;
    var speed= Math.floor(Math.sqrt(pos.x *pos.x + pos.y * pos.y)/speedDivisor);
    console.log({heading:heading,speed:speed,altitude:pos.z});
};

steer.motion(handleMotion);

