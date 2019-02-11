const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const symbolCount = random.rangeFloor(2, 6);
  const symbols = ([['++++'], ['****'], ['}fuck}}'], [['))'] + ['((']]]);
  const symbol = random.shuffle(random.pick(symbols)).slice(0, symbolCount);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        // noise
        const radius = Math.abs(random.noise2D(u, v)) * 0.05;
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v],
          symbol: random.pick(symbol),
        });
      }
    }
    return points;
  };

  // deterministic randomness
  // random.setSeed(5);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;


  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation,
        symbol
      } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, width - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(symbol, 0, 0);
      context.restore();


    });

  };
};

canvasSketch(sketch, settings);

