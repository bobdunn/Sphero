exports.motion = function(callback) {

    var Leap = require('leapjs');
    var timestamp = 0;
    var timoutMicroseconds = 100 * 1000;

    Leap.loop(function (frame) {
        if (frame.hands.length > 0) {
            var pos = frame.hands[0].palmPosition;
            if (timestamp === 0) timestamp = frame.timestamp;

            if (frame.timestamp - timestamp > timoutMicroseconds) {
                timestamp = frame.timestamp;
                callback({x:pos[0], y:pos[2], z:pos[1]});
            }
        }
    });
}

