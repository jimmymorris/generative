const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

// You can force a specific seed by replacing this with a string value
const defaultSeed = '';

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log('Random Seed:', Random.getSeed());

const settings = {
  suffix: Random.getSeed(),
  dimensions: 'A5',
  orientation: 'portrait',
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'cm',
  bleed: 0.75
};

const sketch = (props) => {
  const { context, bleed, width, height } = props;
  const gridSize = 16;
  const padding = width * 0.2;
  const tileSize = (width - padding * 2) / gridSize;
  const playhead = 0;
  const lines = [];

  const paths = createPath(() => {
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        // scale to dimensions with a border padding
        const tx = math.lerp(padding, width - padding, u);
        const ty = math.lerp(padding, height - padding, v);

        // here we get a 't' value between 0..1 that
        // shifts subtly across the UV coordinates
        const offset = u * 0.2 + v * 0.1;
        const t = offset % 1;

        // now we get a value that varies from 0..1 and back
        let mod = Math.sin(t * Math.PI);

        // we make it 'ease' a bit more dramatically with exponential
        mod = Math.exp(mod, 3);

        // now choose a length, thickness and initial rotation
        const length = tileSize * 0.75;
        const thickness = tileSize * 0.1;
        const initialRotation = Math.PI / 2;

        // And rotate each line a bit by our modifier
        const rotation = initialRotation + mod * Math.PI;

        // Now render...
        context.save();
        context.fillStyle = 'black';

        // Rotate in place
        context.translate(tx, ty);
        context.rotate(rotation);
        context.translate(-tx, -ty);

        // Draw the line
        context.fillRect(tx - length / 2, ty - thickness / 2, length, thickness);

        context.restore();
      }
    }
  })

  // Clip to bounds, using a bleed in working units
  const box = [ bleed, bleed, width - bleed, height - bleed ];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPaths(lines, {
    ...props,
    lineJoin: 'round',
    lineCap: 'round',
    // in working units; you might have a thicker pen
    lineWidth: 0.07,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);
