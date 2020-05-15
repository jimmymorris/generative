const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1024, 1024]
};

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sketch = () => {
  return ({ context, width, height }) => {
    context.lineWidth = 2;

    var circles = [];
    var minRadius = 2;
    var maxRadius = 256;
    var totalCircles = 1280;
    var createCircleAttempts = 1280;

    function createAndDrawCircle() {

      var newCircle;
      var circleSafeToDraw = false;
      for (var tries = 0; tries < createCircleAttempts; tries++) {
        newCircle = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * width),
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
        const otherCircle = circles[i];
        const a = circle.radius + otherCircle.radius;
        const x = circle.x - otherCircle.x;
        const y = circle.y - otherCircle.y;

        if (a >= Math.sqrt((x * x) + (y * y))) {
          return true;
        }
      }

      if (circle.x + circle.radius >= width ||
        circle.x - circle.radius <= 0) {
        return true;
      }

      if (circle.y + circle.radius >= width ||
        circle.y - circle.radius <= 0) {
        return true;
      }

      return false;
    }

    for (var i = 0; i < totalCircles; i++) {
      createAndDrawCircle();
    }

  }
};

canvasSketch(sketch, settings);
