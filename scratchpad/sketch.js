const sketcher = require('canvas-sketch');
const p5 = require('p5');
const Random = require('canvas-sketch-util/random');

const settings = {
  duration: 15,
  dimensions: [512, 512],
  p5: { p5 },
  scaleToView: true,
  playbackRate: 'throttle',
  animate: true,
  fps: 24
};

const sketch = () => {
  const seed = Random.setSeed('Franny Dog is the best');
  return ({ p5, playhead, context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    Random.setSeed(seed);
    const square = 48;
    const margin = 20;
    const gridSize = 16;

    for (var x = margin; x < width - margin; x += (width - margin) / 8) {
      for (var y = margin; y < height - margin; y += (height - margin) / 8) {

        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        const offset = u * 0.2 + v * 0.1;
        const t = (playhead + offset) % 1;

        let mod = Math.sin(t * Math.PI);
        mod = Math.pow(mod, 3);
        context.save();
        let region = new Path2D();
        region.rect(x, y, square, square);
        context.lineWidth = 1;
        context.stroke(region);
        context.clip(region)

        const density = Math.abs(p5.tan(mod)) * 64;

        for (let i = 0; i < density; i += 1) {
          p5.stroke(255, 0, 0)
          p5.strokeWeight(1)
          p5.noFill()
          const cx = p5.random(x, x + square);
          const cy = p5.random(y, y + square);
          const cr = Random.noise2D(cx, cy, t) * 100
          p5.circle(cx, cy, cr)
        }
        context.restore();
      }
    }
  }
};

sketcher(sketch, settings);