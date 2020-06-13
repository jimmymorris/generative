const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

const settings = {
  dimensions: [1024, 1024],
  p5: { p5 }
};

canvasSketch(() => {
  let noiseMax = 2.5;
  return ({ p5, context, width, height }) => {
    const gridSize = 3;
    const padding = width * 0.2;

    const tileSize = (width - padding * 2) / gridSize;

    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);
        const tx = p5.lerp(padding, width - padding, u);
        const ty = p5.lerp(padding, height - padding, v);

        context.beginPath()
        p5.strokeWeight(5);
        p5.fill('#0077b6')
        p5.ellipse(tx, ty, tileSize * 1.25);
        p5.push();
        createIsland({
          p5,
          strokeWeight: 5,
          phase: p5.random(x),
          cx: tx - 100,
          cy: ty,
          tileSize: tileSize * p5.random(1.15, 1.35)
        });
        // createIsland({
        //   p5,
        //   strokeWeight: 4,
        //   phase: p5.random(1, 2),
        //   cx: tx,
        //   cy: ty,
        //   tileSize: tileSize * p5.random(1.15, 1.35)
        // });
        p5.pop();
        p5.strokeWeight(5);
      }
    }


  function createIsland({ p5, strokeWeight, phase, cx, cy, tileSize }) {
    let zoffset = p5.noise(phase);
    p5.stroke('#faf3dd');
    p5.strokeWeight(strokeWeight);
    p5.fill('#81b29a');
    p5.translate(cx, cy);
    p5.beginShape();
    for (let a = 0; a < p5.TWO_PI; a += 0.1) {
      let xoffset = p5.map(Math.cos(a + phase), -1, 1, cx, cx + noiseMax);
      let yoffset = p5.map(Math.sin(a - phase), -1, 1, cy, cy - noiseMax);
      let r = p5.map(
        p5.noise(xoffset, yoffset, zoffset),
        0,
        1,
        tileSize * .05,
        tileSize * .4
      );
      let x = r * Math.cos(a);
      let y = r * Math.sin(a);
      p5.vertex(x, y);
    }
    p5.endShape(p5.CLOSE);
  }
}, settings);