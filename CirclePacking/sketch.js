const p5 = require('p5')
const canvasSketch = require('canvas-sketch');
const Random  = require('canvas-sketch-util/random')

const settings = {
  dimensions: [900, 1600],
  p5: { p5 },
  pixelsPerInch: 300,
};

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const X_AXIS = 'X_AXIS';
const Y_AXIS = 'Y_AXIS';



/*
share1: { seed: "749629", randomColor: 0 }
share2: {seed: "453869", randomColor: 1}

{ seed: "822425", randomColor: 1 }
{ seed: "410467", randomColor: 2 }

""


{seed: "785851", randomColor: 1}

*/



const sketch = ({ p5 }) => {

  const monochrome = {
    background: p5.color('#FFF'),
    start: p5.color('#000'),
    end: p5.color('#000'),
    line: p5.color('#000')
  }

  const colorCombos = [
    {
      background: p5.color('#FCF6B1'),
      line: p5.color('#E3170A'),
      start: p5.color('#A9E5BB'),
      end: p5.color('#F7B32B'),
    },
    {
      background: p5.color('#14213d'),
      line: p5.color('#FF6B6B'),
      start: p5.color('#a8dadc'),
      end: p5.color('#9bf6ff'),
    },
    {
      background: p5.color('#003049'),
      line: p5.color('#FFF'),
      start: p5.color('#F1FAEE'),
      end: p5.color('#f77f00'),
    }
  ]

  return ({ p5, context, width, height }) => {

    Random.createRandom(Random.getRandomSeed());
    const seed = Random.getRandomSeed();
    const goodSeeds = [95475, 313810, 137269, 822752, 219750, 877323, 175672, 102767, 453869, 749629, 822425, 410467, 453869, 785851]
    Random.setSeed(822752);
    const border = 32;
    const drawWidth = width - border;
    const drawHeight = height - border;

    const strokeWeight = 2;
    const minRadius = 4;
    const maxRadius = 180;
    const totalCircles = 1000;
    const createAttempts = 1000;
    const randomColor = parseInt(Random.rangeFloor(colorCombos.length))

    const colors = colorCombos[2];
    // const colors = monochrome;

    let circles = [];

    console.log({seed, randomColor});

    function Circle({x, y}) {
      this.x = x;
      this.y = y;
      this.r = minRadius;

      this.updateRadius = (radius) => {
        this.r = radius;
      }

      this.edges = () => {
        return (
          this.x + this.r >= drawWidth ||
          this.x - this.r <= border ||
          this.y + this.r >= drawHeight ||
          this.y - this.r <= border
        );
      };

      this.notSelf = ({x, y, r}) => {
        return (
          this.x !== x,
          this.y !== y,
          this.r !== r
        )
      }

      this.hasCollison = () => {
        for (let i = 0; i < circles.length; i++) {
          var other = circles[i];
          const d = p5.dist(this.x, this.y, other.x, other.y)
          const distance = this.r + other.r

          if (d - strokeWeight < distance) {
            return true;
          }
        }

        if (this.x + (this.radius * 2) > drawWidth ||
          this.x - (this.radius * 2) < border) {
          return true;
        }

        if (this.y + (this.radius * 2) > drawHeight ||
          this.y - (this.radius * 2) < border) {
          return true;
        }

        return false;
      }
    }

    const createCircles = (numCircles) => {
      let good2Draw = false;
      for (let i = 1; i <= numCircles; i += 1) {
        for(let tries = 0; tries < createAttempts; tries += 1) {
          circle = new Circle({
            x: Random.range(border, drawWidth),
            y: Random.range(border, drawHeight),
            radius: minRadius
          });

          if (!circle.hasCollison(circles)) {
            good2Draw = true;
            break;
          }
        }

        if(!good2Draw) {
          return null;
        }

        for (let newRadius = minRadius; newRadius < maxRadius; newRadius += 1) {
          circle.updateRadius(newRadius);
          if (circle.edges() || circle.hasCollison()) {
            circle.updateRadius(newRadius -= strokeWeight);
            break;
          }
        }

        circles.push(circle)
      }

      return circles
    }

    circles = createCircles(totalCircles).sort((a, b) => a.y > b.y ? -1 : 1);

    p5.background(colors.background)

    const connections = circles.filter((circle) => circle.r > maxRadius * 0.5)

    // circles = circles.filter((circle) => circle.r <= maxRadius * 0.5)

    circles.map((circle, idx) => {
      let fillColor = p5.lerpColor(colors.start, colors.end, idx / circles.length);

      p5.noFill();
      p5.stroke(fillColor);
      p5.strokeWeight(strokeWeight)
      p5.ellipse(
        circle.x,
        circle.y,
        circle.r * 2
      )
    })

    p5.stroke(colors.line);
    p5.strokeWeight(strokeWeight)
    for(let i = 0; i < connections.length; i += 1) {
      const currentNode = connections[i];
      for (let j = 1; j < connections.length; j += 1) {
        const destinationNode = connections[j];
        p5.line(currentNode.x, currentNode.y, destinationNode.x, destinationNode.y);
      }
    }
  }

};


  canvasSketch(sketch, settings);
