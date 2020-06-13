const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: 'A5',
  pixelsPerInch: 300,
  p5: { p5 }
};

const sketch = () => {

  return ({p5, context, width, height }) => {
    const startColor = p5.color('#F1FAEE');
    const endColor = p5.color('#f77f00');

    const colorArray = ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8']

    const cx = width / 2;
    const cy = width / 2;

    const radius = width * 0.75;

    p5.translate(cx, cy);
    p5.strokeWeight(3)
    p5.ellipse(0, 0, radius)
    p5.stroke('black');
    let steps = p5.TWO_PI / 6;
    p5.curveDetail(5);

    const points = [];
    for (let j = 0; j < 64; j += 1) {
      const angle = math.degToRad(random.rangeFloor(360));
      const step = math.degToRad(random.range(15, 75));
      const x = (radius / 2) * Math.sin((angle + step) * random.noise2D(angle, p5.TWO_PI, j, 10));
      const y = (radius / 2) * Math.cos((angle + step) * random.noise2D(angle, p5.TWO_PI, j, 10));
      points.push({x, y})
    }

    for(let d = 1; d < points.length; d += 1) {
      let { x, y } = points[d];
      p5.stroke(0);
      p5.noFill();
      p5.beginShape();
      p5.vertex(points[0].x, points[0].y);
      // p5.vertex(0,0);
      p5.vertex(x, y);
      p5.endShape();
    }
  };
};

canvasSketch(sketch, settings);
