const canvasSketch = require('canvas-sketch');
const ln = require("@lnjs/core");


const settings = {
  parent: false,
  dimensions: 'A5',
  orientation: 'portrait',
};

const sketch = () => {
  const scene = new ln.Scene();
  const n = 3;
  return ({ context, width, height, bleed }) => {
    console.log(width, height)
    for (let x = -n; x <= n; x++) {
      for (let y = -n; y <= n; y++) {
        const p = Math.random() * 0.25 + 0.2;
        const dx = Math.random() * 0.5 - 0.25;
        const dy = Math.random() * 0.5 + 0.75;
        const z = 3;
        const fx = x;
        const fy = y;
        const fz = Math.random() * 3 + 1;
        if (x === 2 && y === 1) {
          continue
        }
        const shape = new ln.Cube(
          new ln.Vector(fx - p, fy - p, 0),
          new ln.Vector(fx + p, fy + p, fz)
        );
        scene.add(shape);
      }
    }

    let eye = new ln.Vector(2.75, 3.25, 7.5);
    let center = new ln.Vector(0, 0, 0);
    let up = new ln.Vector(0, 0, 1);
    let paths = scene.render(eye, center, up, width, height, 100, 0.01, 10, 0.01);
    let svg = ln.toSVG(paths, width - (bleed * 2), height - (bleed * 2));
    document.body.innerHTML = svg;
  };
};

canvasSketch(sketch, settings);
