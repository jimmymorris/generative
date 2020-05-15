const sketcher = require('canvas-sketch');
const p5 = require('p5');
const Random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [512, 512],
  p5: { p5 },
};

const sketch = () => {
  // const seed = Random.setSeed('Franny Dog is the best');
  return ({ p5, context, width, height }) => {
    // Random.setSeed(seed);
    const square = 48;
    const margin = 20;

    for (var x = margin; x < width - margin; x += (width - margin) / 8) {
      for (var y = margin; y < height - margin; y += (height - margin) / 8) {
        const density = Math.abs(Random.noise2D(x, y, height, width));
        context.save();
        let region = new Path2D();
        region.rect(x, y, square, square);
        context.lineWidth = 1;
        context.stroke(region);
        context.clip(region)

        for (let i = 0; i < density; i += 1) {
          p5.stroke(1)
          p5.strokeWeight(1)
          p5.noFill()
          const cx = p5.random(x, x + square);
          const cy = p5.random(y, y + square);
          const cr = Random.noise1D(cx, cy) * 100
          p5.circle(cx, cy, cr)
        }
        context.restore();
      }
    }
  }
};

sketcher(sketch, settings);