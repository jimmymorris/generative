const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random')
const p5 = require('p5');

const settings = {
  dimensions: [1024, 1024],
  p5: { p5 },
};

canvasSketch(({ p5, context, width, height }) => {
  let noiseMax = 5;
  const gridSize = 4;
  const padding = width * 0.2;

  const tileSize = (width - padding * 2) / gridSize;

  return ({ p5, context, width, height }) => {
    p5.background(40)
    p5.stroke(255)
    p5.strokeWeight(2)
    for (let i = 0; i < 10e2; i++) {
      p5.point(p5.random(width), p5.random(height))
    }
    p5.stroke(0)
    p5.strokeWeight(5);
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);
        const tx = p5.lerp(padding, width - padding, u);
        const ty = p5.lerp(padding, height - padding, v);

        context.save();

        context.beginPath()
        p5.fill(p5.random(0, 1) >= .5 ? '#0077b6' : '#FDF5D5')
        p5.ellipse(tx, ty, tileSize * 1.25);

        let earth = new Path2D();
        earth.arc(tx, ty, tileSize * .64, 0, Math.PI * 2);
        context.lineWidth = 4;
        context.clip(earth);


        p5.push();
        createIsland({
          p5,
          strokeWeight: 5,
          phase: p5.random(x),
          cx: tx - p5.random(85, 100),
          cy: ty + p5.random(-80, 80),
          tileSize: tileSize * p5.random(1.55, 1.75)
        });
        p5.pop();

        p5.push();
        createIsland({
          p5,
          strokeWeight: 4,
          phase: p5.random(1, 2),
          cx: tx + p5.random(85, 100),
          cy: ty + p5.random(-80, 80),
          tileSize: tileSize * p5.random(1.55, 1.75)
        });
        p5.pop();
        p5.strokeWeight(5);
        p5.noFill();
        p5.ellipse(tx, ty, tileSize * 1.25);
        context.restore();
      }
    }


    function createIsland({ p5, strokeWeight, phase, cx, cy, tileSize }) {
      let zoffset = Random.noise1D(phase);
      p5.stroke('#000');
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
          (tileSize * .1),
          (tileSize * .4),
        );
        let x = r * Math.cos(a);
        let y = r * Math.sin(a);
        p5.vertex(x, y);
      }
      p5.endShape(p5.CLOSE);
    }
  }
}, settings);