const sketcher = require('canvas-sketch');
const p5 = require('p5');
const Random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [512, 512],
  p5: { p5 },
};

const sketch = () => {
  const seed = Random.setSeed('Franny Dog is the best');
  return ({ p5, context, width, height }) => {
    Random.setSeed(seed);
    const rectHeight = 80;
    const spacer = 40;

    context.save()
    let lightRegion = new Path2D();
    let x = 20;
    let y = 20;
    let rh = y + rectHeight

    lightRegion.rect(x, y, width - 40, rectHeight);
    context.lineWidth = 4;
    context.stroke(lightRegion);
    context.clip(lightRegion, 'nonzero');

    for (let i = 0; i < 350; i += 1) {
      p5.stroke(1)
      p5.strokeWeight(1)
      p5.noFill()
      const cx = p5.random(x, width - 40);
      const cy = p5.random(y, y + rectHeight);
      const cr = Random.noise1D(cx, cy) * 100
      p5.circle(cx, cy, cr)
    }

    context.restore();

    context.save();

    x = 20;
    y += rectHeight + spacer;
    rh = rectHeight

    let mediumRegion = new Path2D();
    mediumRegion.rect(x, y, width - 40, 80);
    context.lineWidth = 4;
    context.stroke(mediumRegion);
    context.clip(mediumRegion, 'nonzero');

    for (let i = 0; i < 700; i += 1) {
      p5.stroke(1)
      p5.strokeWeight(1)
      p5.noFill()
      const cx = p5.random(x, width - 40);
      const cy = p5.random(y, y + rectHeight);
      const cr = Random.noise1D(cx, cy) * 100
      p5.circle(cx, cy, cr)
    }

    context.restore();

    context.save();

    x = 20;
    y += rectHeight + spacer;
    rh = rectHeight

    let heavyRegion = new Path2D();
    heavyRegion.rect(x, y, width - 40, 80);
    context.lineWidth = 4;
    context.stroke(heavyRegion);
    context.clip(heavyRegion, 'nonzero');

    for (let i = 0; i < 1000; i += 1) {
      p5.stroke(1)
      p5.strokeWeight(1)
      p5.noFill()
      const cx = p5.random(x, width - 40);
      const cy = p5.random(y, y + rectHeight);
      const cr = Random.noise1D(cx, cy) * 100
      p5.circle(cx, cy, cr)
    }

    context.restore();
  }
};

sketcher(sketch, settings);