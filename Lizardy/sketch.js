const canvasSketch = require('canvas-sketch');
const SimplexNoise = require('simplex-noise')
const math = require('canvas-sketch-util/math')
const { lerp } = require('canvas-sketch-util/math');

const simplex = new SimplexNoise(Math.random());
let scale = 0.002;
const settings = {
  dimensions: [1600, 1600],
};

const sketch = () => {
  return ({ playhead, context, width, height }) => {
    const w = width * 2;
    const h = height * 2;
    const r = 120;
    const yDelta = Math.cos(Math.PI / 3) * r
    let even = true;

    for (let y = -30; y < h; y += yDelta) {
      let offset = 0
      if (even) {
        offset = r * 1.5;
      }
      for (let x = -30; x < w; x += r * 3) {
        context.beginPath();
        hexagon({
          context,
          x: x + offset,
          y,
          r,
          playhead
        });
        context.fillStyle = getShading(x + offset, y);
        context.fill();
        context.stroke();
      }
      even = !even;
    }

  };
};

canvasSketch(sketch, settings);


function perlinize(x, y) {
  const strength = 16;
  const angle = simplex.noise2D(x * scale, y * scale) * Math.PI;
  return {
    x: x + Math.cos(angle) * strength,
    y: y + Math.sin(angle) * strength,
  }
}

function hexagon({ context, x, y, r, playhead }) {
  let angle = 0;
  for (let i = 0; i < 8; i++) {
    const p = perlinize(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
    context.lineTo(p.x, p.y + (Math.cos(Math.PI / 3) * playhead) * 100);
    angle += Math.PI / 4;
  }
  context.closePath();

}

function getShading(x, y) {
  const value = (simplex.noise2D(x * scale, y * scale) + 1) / 2;
  const hue = math.mapRange(value, -1, 1, 60, 180);
  const lightness = math.mapRange(value, -1, 1, 40, 90);
  return `hsl(${hue}, 40%, ${lightness}%)`;
}