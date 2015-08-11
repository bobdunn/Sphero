var width = 800;
var height = 800;
var svgContainer = d3.select("#svgContainer").append("svg")
  .attr("width", width)
  .attr("height", height);

var outerSquare = svgContainer.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "black");

var innerSquare = svgContainer.append("rect")
  .attr("x", 2)
  .attr("y", 2)
  .attr("width", width - 4)
  .attr("height", height - 4)
  .attr("fill", "white");

var socket = io();
var currentPoint, targetPoint;
socket.on('message', function(msg) {

  if (currentPoint) {
    var hue = 180 * (Math.sin(msg.velocity.speed * Math.PI / 1000) +
      1);
    currentPoint.transition()
      .duration(250)
      .attr("cx", msg.position.x * 4 + width / 2)
      .attr("cy", -msg.position.y * 4 + height / 2)
      .attr("fill", "hsl(" + hue + ",100%,50%)");
    //            console.log(msg)
  } else {
    currentPoint = svgContainer.append("circle")
      .attr("cx", msg.position.x * 4 + width / 2)
      .attr("cy", -msg.position.y * 4 + height / 2)
      .attr("r", 5);
  }
  document.getElementById('pre').innerHTML = JSON.stringify(msg, undefined,
    2);

});

var drawTarget = function(position) {
  if (!targetPoint) {
    targetPoint = svgContainer.append("circle")
      .attr("cx", position.x)
      .attr("cy", position.y)
      .attr("r", 7);
  } else {
    targetPoint.transition()
      .duration(250)
      .attr("cx", position.x)
      .attr("cy", position.y);
  }
}

var clearTarget = function() {
  targetPoint.remove();
  targetPoint = undefined;
  socket.emit('setTarget', {})
}

var moveRandomly = function() {
  clearTarget();
  socket.emit('moveRandomly');
}

var svgElement = document.getElementById('svgContainer');
var svgSquare = svgElement.getBoundingClientRect();
svgElement.onclick = function(data) {
  drawTarget({
    x: data.offsetX,
    y: data.offsetY
  });
  socket.emit('setTarget', {
    x: (data.layerX - svgSquare.left - svgSquare.width / 2) /
      (svgSquare.width / 2),
    y: -(data.layerY - svgSquare.top - svgSquare.height / 2) /
      (svgSquare.height / 2)
  });
}
