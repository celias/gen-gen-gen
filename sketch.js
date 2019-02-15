const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 1024]
};

const sketch = ({ width, height }) => {
  // random palette of 1-5 colors
  const nColors = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, nColors);
  const background = 'white';

  // padding around edges
  const margin = width * 0.02;

  // Create a grid of points (in pixel space) within the margin bounds
  const createGrid = () => {
    const xCount = 6;
    const yCount = 6;
    const points = [];

    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        const u = x / (xCount - 1);
        const v = y / (yCount - 1);
        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);
        points.push([px, py]);
      }
    };
    console.log(points);
    return points;
  };

  // create the grid
  let grid = createGrid();

  // create the shapes
  let shapes = [];

  // As long as we have 2 grid points left
  while (grid.length > 2) {
    // select two random points from the grid
    const pointsToRemove = random.shuffle(grid).slice(0, 2);
    // not enough points then just break out
    if (pointsToRemove.length < 2) {
      break;
    }

    // the color of the trapezoid
    const color = random.pick(palette);

    // filter these points out of the grid
    grid = grid.filter(p => !pointsToRemove.includes(p));

    // form the trapezoid from points A to B
    const [a, b] = pointsToRemove;

    shapes.push({
      color,
      // The path goes from the bottom of the page,
      // up to the first point,
      // through the second point,
      // and then back down to the bottom of the page
      path: [
        [a[0], height - margin],
        a,
        b,
        [b[0], height - margin]
      ],
      // The average Y position of both grid points
      // This will be used for layering
      y: (a[1] + b[1]) / 2
    });
  }

  // Sort/layer the shapes according to their average Y position
  shapes.sort((a, b) => a.y - b.y);

  // Now render
  return ({ context, width, height }) => {
    // make sure alpha is back to 1.0 before
    // you draw the background color
    context.globalAlpha = 1;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    shapes.forEach(({ lineWidth, path, color }) => {
      context.beginPath();
      path.forEach(([x, y]) => {
        context.lineTo(x, y);
      });
      context.closePath();

      // Draw the trapezoid with specific color
      context.lineWidth = 20;
      context.globalAlpha = 0.85;
      context.fillStyle = color;
      context.fill();

      // Outline the full opacity
      context.lineJoin = context.lineCap = 'round';
      context.strokeStyle = background;
      context.globalAlpha = 1;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);