const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const gatherSettings = (form) => {
  return Array.from(form.elements).filter(element => element.tagName !== 'BUTTON').reduce((accumulator, element) => {
    accumulator[element.id] = element.value;
    return accumulator;
  }, {});
};

const restructureSettings = (settings) => ({
  size: {
    width: settings['size-x'],
    height: settings['size-y'],
  },
  colors: {
    background: settings['color-background'],
    branch: settings['color-branch'],
  },
  length: {
    value: settings['length-branch'],
    variation: settings['length-branch-variation'],
    falloff: settings['length-branch-falloff'],
  },
  angle: {
    value: settings['angle-branch'],
    variation: settings['angle-branch-variation'],
  },
  depth: settings['depth-branch'],
});

const drawBranch = (origin, length, falloff, lengthVariation, angle, angleChange, angleVariation, depth, maxDepth) => {
  const theta = 2 * Math.PI * (angle / 360);

  context.save();

  context.translate(origin.x, origin.y);
  context.rotate(theta);
  context.fillRect(0, 0, 1, -length);

  context.restore();

  if(depth + 1 < maxDepth) {
    const newOrigin = {
      x: origin.x - length * Math.cos(theta + Math.PI / 2),
      y: origin.y - length * Math.sin(theta + Math.PI / 2),
    };

    for(let i = -1; i <= 1; i += 2) {
      const newLengthVariation = 1 - (lengthVariation / 100) + Math.random() * (lengthVariation * 2 / 100);
      const newLength = length * (falloff / 100) * newLengthVariation;

      const newAngleVariation = 1 - (angleVariation / 100) * Math.random() * (angleVariation * 2 / 100);
      const newAngle = (angle + (angleChange * i)) * newAngleVariation;

      drawBranch(
        newOrigin,
        newLength,
        falloff,
        lengthVariation,
        newAngle,
        angleChange,
        angleVariation,
        depth + 1,
        maxDepth
      );
    }
  }
};

const drawTree = (settings) => {
  canvas.width = settings.size.width;
  canvas.height = settings.size.height;

  context.fillStyle = settings.colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = settings.colors.branch;
  context.translate(canvas.width / 2, canvas.height);
  drawBranch(
    {x: 0, y: 0},
    settings.length.value,
    settings.length.falloff,
    settings.length.variation,
    0,
    settings.angle.value,
    settings.angle.variation,
    0,
    settings.depth,
  );
};

const form = document.querySelector('#form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const settings = gatherSettings(event.target);
  const restructured = restructureSettings(settings);
  drawTree(restructured);
});