var getPolar=function(p0,p1){
    var dx = p0.x - p1.x;
    var dy = p0.y - p1.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var angle = ((((Math.atan2(dx, dy) + Math.PI) * 180 / Math.PI) + 180) % 360).toFixed();
    return {r:distance,theta:angle};
};


this.exports.getPolar=getPolar;