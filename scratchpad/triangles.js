const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const p5 = require('p5');

const settings = {
  dimensions: [ 768, 768 ],
  p5: { p5 }
};

const sketch = () => {
  const randomDisplacement = 20;
  const rotateMultiplier = 15;
  const offset = 10;
  const squareSize = 64;
  const triHeight = squareSize * (3 ** 0.5) / 2;

  return ({ p5, context, width, height }) => {
    function draw(w, h) {
      const x1 = w + (triHeight / 2),
            y1 = h,
            x2 = w + triHeight,
            y2 = h + triHeight,
            x3 = w,
            y3 = h + triHeight;
      // context.beginPath();
      // p5.fill('red')
      // p5.ellipse(x1, y1, 10)
      // p5.fill('green')
      // p5.ellipse(x2, y2, 10)
      // p5.fill('blue')
      // p5.ellipse(x3, y3, 10)
      p5.beginShape();
      p5.vertex(x1, y1);
      p5.vertex(x2, y2);
      p5.vertex(x3, y3);
      p5.fill(255)
      p5.endShape(p5.CLOSE);
      // context.stroke();
    }

    context.lineWidth = 1;
    // const x = 0;
    // const y = 0;
    for (let x = 0; x < width - (squareSize * 2); x += (squareSize)) {
      for (let y = 0; y < height - (squareSize * 2); y += (squareSize)) {
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        let rotateAmt = y / height * Math.PI / 180 * plusOrMinus * Math.random() * rotateMultiplier;

        plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        let translateAmt = y / height * plusOrMinus * Math.random() * randomDisplacement;

        context.save();
        context.translate(x + translateAmt + offset, y + offset);
        // context.translate(x, y);
        context.rotate(rotateAmt);
        draw(squareSize, squareSize);
        context.restore();
      }
    }
  }
};

canvasSketch(sketch, settings);
