const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');

const settings = {
  dimensions: [ 1024, 1024 ],
  p5: { p5 }
};

const sketch = () => {
  return ({ p5, context, width, height }) => {
    function calcMidpoint(vertices) {
      let midpoint = p5.createVector(0, 0)

      for (let i = 0; i < vertices.length; i++) {
        midpoint.add(vertices[i]);
      }

      return midpoint.div(vertices.length)
    }

    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);
    p5.angleMode(p5.DEGREES);
    const square = 128;
    const margin = 64;
    p5.strokeWeight(4)
    // p5.ellipseMode(p5.center)
    const shape = [];
    const triHeight = square * (3 ** 0.5) / 2;

    const xVerts = [];
    const yVerts = [];

    for (var x = margin; x < width - margin; x += (square + margin)) {
      for (var y = margin; y < height - margin; y += (square + margin)) {
        xVerts.push(...[x + triHeight, x, x + (triHeight / 2)])
        yVerts.push(...[y, y, y + triHeight])
      }
    }

    for (let i = 0; i < xVerts.length; i += 1) {
      shape.push(p5.createVector(xVerts[i], yVerts[i]));
    }

    p5.noStroke();
    for (let i = 0; i < shape.length; i += 3) {
      p5.push();
      p5.fill(255);

      let x1 = shape[i].x,
      y1 = shape[i].y,
      x2 = shape[i + 1].x,
      y2 = shape[i + 1].y,
      x3 = shape[i + 2].x,
      y3 = shape[i + 2].y;

      let a = calcMidpoint([[x1, y1], [x2, y2], [x3, y3]]);

      context.save();

      // context.rotate(15 * Math.PI / 180);

      p5.beginShape();
      p5.vertex(x1, y1);
      p5.vertex(x2, y2);
      p5.vertex(x3, y3);
      p5.fill(255)
      p5.endShape(p5.CLOSE);

      p5.fill(0)
      p5.ellipse(a.x, a.y, 10)
      context.restore();
    }

  }
};

canvasSketch(sketch, settings);
