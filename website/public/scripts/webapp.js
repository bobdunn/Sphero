var width = 800;
var height = 800;
var scale = 1;
var randomInterval;
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

var y_axis = svgContainer.append("rect")
  .attr("x", (width / 2))
  .attr("y", 0)
  .attr("width", 2)
  .attr("height", height)
  .attr("fill", "darkblue");

var x_axis = svgContainer.append("rect")
  .attr("x", 0)
  .attr("y", (width / 2))
  .attr("width", width)
  .attr("height", 2)
  .attr("fill", "darkblue");

var socket = io();
var currentPoint, targetPoint;
socket.on('message', function(msg) {
  drawSpheroPosition(msg.position);
  document.getElementById('pre').innerHTML = JSON.stringify(msg, undefined,
    2);
});

var drawSpheroPosition = function(position) {
  document.getElementById('positionPre').innerHTML =
    JSON.stringify(position, undefined, 2);
  if (currentPoint) {
    currentPoint.transition()
      .duration(250)
      .attr("cx", position.x * 4 + width / 2)
      .attr("cy", -position.y * 4 + height / 2)
      .attr("fill", "red");
  } else {
    currentPoint = svgContainer.append("circle")
      .attr("cx", position.x * 4 + width / 2)
      .attr("cy", -position.y * 4 + height / 2)
      .attr("r", 5);
  }

}

var drawTarget = function(position) {
  if (!targetPoint) {
    targetPoint = svgContainer.append("circle")
      .attr("cx", position.x)
      .attr("cy", position.y)
      .attr("r", 7);
  } else {
    targetPoint.transition()
      .duration(1000)
      .attr("cx", position.x)
      .attr("cy", position.y);
  }
}

var clearTarget = function() {
  if (randomInterval) clearInterval(randomInterval);
  if (targetPoint) {
    targetPoint.remove();
    targetPoint = undefined;
    socket.emit('setTarget', {})
  }
}

var moveRandomly = function() {
  randomInterval = setInterval(function() {
    handleNewTarget({
      x: Math.random() * 800,
      y: Math.random() * 800
    });
  }, 1000);
  // clearTarget();
}

var svgElement = document.getElementById('svgContainer');
var svgSquare = svgElement.getBoundingClientRect();
var scaleValues = function(position, targetSize, gridSize) {
  var translatedPosition = position - gridSize / 2;

  var scaledPosition = translatedPosition * 2 / (targetSize * gridSize);
  return scaledPosition;
}

var handleNewTarget = function(targetPosition) {
  drawTarget(targetPosition);
  socket.emit('setTarget', {
    x: scaleValues(targetPosition.x, scale, width),
    y: -scaleValues(targetPosition.y, scale, height)
  });

}
svgElement.onclick = function(data) {
  if (randomInterval) clearInterval(randomInterval);
  handleNewTarget({
    x: data.offsetX,
    y: data.offsetY
  });
}
