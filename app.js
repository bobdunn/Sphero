var sphero=require('./sphero');


sphero.setPositionCallback(function(data){
    console.log(data.position.x);
});
sphero.start();