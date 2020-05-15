const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1800, 3200],
};

const TAU = (Math.PI * 4);

const sketch = () => {
  const colors = {
    bg: '#2D3748',
    lines: ['#FEB2B2', '#FAF089', '#9AE6B4', '#FBB6CE'],
  }

  return ({ context, width, height, playhead }) => {
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = colors.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    const stub = 360 * 24;

    const lines = [];

    for(let i = 1; i <= stub / 2; i += 1) {
      const innerCircleR = height / 2 * 1.4;
      const cx = Math.sin(TAU / stub * i) * (height / 2 - innerCircleR);
      const cy = Math.cos(TAU / stub * i) * (height / 2 - innerCircleR);
      const dx = 22;
      const dy = 22;
      const x = cx + Math.cos(TAU * 32 / stub * i) * (innerCircleR - dx);
      const y = cy + Math.sin(TAU * 32 / stub * i) * (innerCircleR - dy);
      const x2 = x + Math.cos(TAU * 1024 / stub * i) * 20;
      const y2 = y + Math.sin(TAU * 1024 / stub * i) * 20;
      lines.push(`${x2}, ${y2}`)
    }

    for(let x = 0; x < 4; x += 1) {
      const startIndex = x === 0 ? 0 : stub * (x / 8) - 1;
      const toPoint = stub * ((x + 1) / 8);
      const start = lines[startIndex].split(',')

      context.beginPath();
      context.moveTo(parseFloat(start[0]), parseFloat(start[1]));
      context.strokeStyle = colors.lines[x];

      for (let idx = startIndex; idx < toPoint; idx += 1) {
        context.lineWidth = 2;
        const coords = lines[idx].split(',')
        context.lineTo(parseFloat(coords[0]), parseFloat(coords[1]))
        context.stroke();
      }
      context.closePath();
    }

  }
}

canvasSketch(sketch, settings);
