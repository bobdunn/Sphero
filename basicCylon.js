var Cylon = require('cylon');

Cylon.robot({
    connection: {name: 'sphero', adaptor: 'sphero', port: 'COM6'},
    device: {name: 'sphero', driver: 'sphero'},

    work: function (me) {
        every((1).second(), function () {
            me.sphero.roll(60, Math.floor(Math.random() * 360));
            me.sphero.setRandomColor();
        });
    }
}).start();