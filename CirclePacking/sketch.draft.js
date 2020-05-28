var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = 320;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);

context.lineWidth = 2;

var circles = [];
var minRadius = 2;
var maxRadius = 100;
var totalCircles = 500;
var createCircleAttempts = 500;

function createAndDrawCircle() {

  var newCircle;
  var circleSafeToDraw = false;
  for (var tries = 0; tries < createCircleAttempts; tries++) {
    newCircle = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      radius: minRadius
    }

    if (doesCircleHaveACollision(newCircle)) {
      continue;
    } else {
      circleSafeToDraw = true;
      break;
    }
  }

  if (!circleSafeToDraw) {
    return;
  }

  for (var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize;
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--;
      break;
    }
  }

  circles.push(newCircle);
  context.beginPath();
  context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2 * Math.PI);
  context.stroke();
}

function doesCircleHaveACollision(circle) {
  for (var i = 0; i < circles.length; i++) {
    var otherCircle = circles[i];
    var a = circle.radius + otherCircle.radius;
    var x = circle.x - otherCircle.x;
    var y = circle.y - otherCircle.y;

    if (a >= Math.sqrt((x * x) + (y * y))) {
      return true;
    }
  }

  if (circle.x + circle.radius >= size ||
    circle.x - circle.radius <= 0) {
    return true;
  }

  if (circle.y + circle.radius >= size ||
    circle.y - circle.radius <= 0) {
    return true;
  }

  return false;
}

for (var i = 0; i < totalCircles; i++) {
  createAndDrawCircle();
}
