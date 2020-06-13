const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [ 980, 980 ],
  scaleToFit: true,
  p5: { p5 },
  animate: true,
  fps: 60,
  duration: 15
};

const sketch = ({ p5, context, width, height }) => {

  let maxLines = 10;

  const x1 = (t) => {
    return Math.cos(t / 10) * 140 + Math.sin(t / 10) * 20 + Math.cos(t / 10) * 100
  }

  const y1 = (t) => {
    return Math.sin(t / 5) * 150 + Math.cos(t / 20) * 30 + Math.cos(t / 10) * 10
  }

  const x2 = (t) => {
    return Math.cos(t / 15) * 300 + Math.sin(t) * 2
  }

  const y2 = (t) => {
    return Math.sin(t / 20) * 100 + Math.cos(t / 10) * 100
  }

  const background = '#1b263b';
  const line1 = '#fcfcfc';
  const line2 = '#ef476f';

  return ({ time, width, height }) => {
    let timeFactor = time * 24

    p5.background(background)
    p5.strokeWeight(3)
    p5.translate(width / 2, height / 2)

    p5.stroke(line1);
    for (let i = 0; i < maxLines; i += 1) {
      p5.line(x2(i), y2(i + timeFactor), x1(i + timeFactor), y1(i + timeFactor))
    }

    p5.stroke(line2);
    for (let i = 0; i < maxLines; i += 1) {
      p5.line(-x2(i), y2(i + timeFactor), -x1(i + timeFactor), y1(i + timeFactor))
    }
  };
};

canvasSketch(sketch, settings);
