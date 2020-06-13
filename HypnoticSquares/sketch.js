const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: 'A5',
  orientation: 'landscape',
  pixelsPerInch: 300,
  scaleToView: true
};

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sketch = () => {
  return ({ context, width, height }) => {

    // margin in inches
    const margin = 1 / 4;

    // starting settings
    let size = width - margin;
    let finalSize = 3;
    let startSteps;
    let offset = 3;
    let tileStep = (width - offset * 2) / 8;
    let startSize = tileStep;
    let directions = [-1, 0, 1];

    // off white background
    context.lineWidth = 2;

    const draw = (x, y, width, height, xMovement, yMovement, steps) => {
      if (steps >= 0) {
        let newSize = (startSize) * (steps / startSteps) + finalSize;

        let newX = x + (width - newSize) / 2
        let newY = y + (height - newSize) / 2

        newX = newX - ((x - newX) / (steps + 2)) * xMovement;
        newY = newY - ((y - newY) / (steps + 2)) * yMovement;

        context.beginPath();
        context.rect(x, y, width, height);
        context.stroke();

        draw(newX, newY, newSize, newSize, xMovement, yMovement, steps - 1);
      }
    }

      context.clearRect(0, 0, width, height);
      for (let x = offset; x < size - offset; x += tileStep) {
        for (let y = offset; y < size - offset; y += tileStep) {
          startSteps = 2 + Math.ceil(Math.random() * 3);

          const xDirection = directions[Math.floor(Math.random() * directions.length)]
          const yDirection = directions[Math.floor(Math.random() * directions.length)]
          draw(x, y, startSize, startSize, xDirection, yDirection, startSteps - 1);
        }
      }

  };
};

canvasSketch(sketch, settings);
