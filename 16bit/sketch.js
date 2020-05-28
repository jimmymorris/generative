const canvasSketch = require('canvas-sketch');
const p5 = require('p5')
const Random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [1024, 1024],
  p5: { p5 }
};

const sketch = () => {
  return ({ p5, context, width, height }) => {
    const squares = [];
    for(let i = 0; i < 16; i += 1) {
      for (let j = 0; j < 16; j += 1) {
        squares.push({
          points: [i * 64, j * 64, 64],
          fill: Random.boolean()
        })
      }
    }

    for(let s = 0; s < squares.length; s += 1) {
      if (squares[s].fill) {
        p5.fill(0)
        console.log(squares[s].fill);
      } else {
        p5.noFill()
      }
      p5.noStroke()
      p5.square(...squares[s].points)
    }
  }
};

canvasSketch(sketch, settings);
