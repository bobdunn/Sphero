var cv = require('./node_modules/opencv/lib/opencv');

console.log('loaded cv!');
cv.readImage("./images/input.jpg", function (err, im) {
    im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
        console.log('Found ' + faces.length + ' faces!');
        for (var i = 0; i < faces.length; i++) {
            var x = faces[i]
            im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
        }
        im.save('./images/out.jpg');
    });
})