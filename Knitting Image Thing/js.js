const SQUARE_SIZE = 40;
const SQUARE_BORDER = 1;

const STYLE_ROUND = 1;
const STYLE_STRAIGHT = 2;

const ON_COLOUR = '#000';
const OFF_COLOUR = '#FFF';
const BACKGROUND_COLOUR = '#9775AA';
const STRAIGHT_DIVIDER = '#3D1255';

document.getElementById("goButtonRoundStyle").addEventListener('click', function() {
  drawOutputToCanvas(STYLE_ROUND);
});

document.getElementById("goButtonStraightStyle").addEventListener('click', function() {
  drawOutputToCanvas(STYLE_STRAIGHT);
});

function drawGridStraightStyle(context, canvas, lines1, lines2, maxWidth, maxHeight) {
  context.fillStyle = BACKGROUND_COLOUR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (var yFromZero = 0; yFromZero < maxHeight; yFromZero++) {
    for (var x = 0; x < maxWidth; x++) {
      var y = maxHeight - yFromZero - 1;

      var value1 = getAtCoord(lines1, x, y, '0');
      var value2 = getAtCoord(lines2, x, y, '0');

      context.fillStyle = STRAIGHT_DIVIDER;
      if (y > 0) {
        context.fillRect(
          0,
          y * 2 * SQUARE_SIZE - SQUARE_BORDER,
          canvas.width,
          SQUARE_BORDER * 2
        );
      }

      // From the bottom up...
      if (yFromZero % 2 == 0) {
        // First one
        drawRect(context, x, y * 2 + 1, getColour(value1));
        // Second Reversed
        drawRect(context, maxWidth - x - 1, y * 2, getColour(!value2));

      } else {
        // Second
        drawRect(context, x, y * 2 + 1, getColour(!value2));
        // First Reversed
        drawRect(context, maxWidth - x - 1, y * 2, getColour(value1));
      }
      // Repeat...
    }
  }
}

function drawGridRoundStyle(context, canvas, lines1, lines2, maxWidth, maxHeight) {
  context.fillStyle = BACKGROUND_COLOUR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < maxHeight; y++) {
    for (var x = 0; x < maxWidth; x++) {
      var value1 = getAtCoord(lines1, x, y, '0');
      var value2 = getAtCoord(lines2, maxWidth - x - 1, y, '0');

      // Second one reversed, then...
      drawRect(context, x * 2, y, getColour(!value2));
      // First one.
      drawRect(context, x * 2 + 1, y, getColour(value1));
      // Repeat
    }
  }
}

function getAtCoord(lineGrid, x, y, nullChar) {
  if (
    0 <= y && y < lineGrid.length &&
    0 <= x && x < lineGrid[y].length
  ) {
    return lineGrid[y][x] !== nullChar;
  }
  return false;
}

function getColour(on) {
  return on ? ON_COLOUR : OFF_COLOUR;
}

function drawOutputToCanvas(style) {
  var canvas = document.getElementById("outputCanvas");
  var canvasImage = document.getElementById('canvasImage');
  var pattern1 = document.getElementById("pattern1");
  var pattern2 = document.getElementById("pattern2");

  var context = canvas.getContext('2d');

  var lines1 = trim(pattern1.textContent.replace(' ', ''), ',').split("\n");
  var lines2 = trim(pattern2.textContent.replace(' ', ''), ',').split("\n");

  var maxWidth = 0;
  var maxHeight = 0;
  for (var i = 0; i < lines1.length; i++) {
    lines1[i] = lines1[i].split(",");
    maxWidth = Math.max(maxWidth, lines1[i].length);
  }
  for (var i = 0; i < lines2.length; i++) {
    lines2[i] = lines2[i].split(",");
    maxWidth = Math.max(maxWidth, lines2[i].length);
  }
  maxHeight = Math.max(lines1.length, lines2.length);

  if (style == STYLE_ROUND) {
    canvas.width = SQUARE_SIZE * maxWidth * 2;
    canvasImage.width = SQUARE_SIZE * maxWidth * 2;
    canvas.height = SQUARE_SIZE * maxHeight;
    canvasImage.height = SQUARE_SIZE * maxHeight;

    drawGridRoundStyle(context, canvas, lines1, lines2, maxWidth, maxHeight);
  } else if (style == STYLE_STRAIGHT) {
    canvas.width = SQUARE_SIZE * maxWidth;
    canvasImage.width = SQUARE_SIZE * maxWidth;
    canvas.height = SQUARE_SIZE * maxHeight * 2;
    canvasImage.height = SQUARE_SIZE * maxHeight * 2;

    drawGridStraightStyle(context, canvas, lines1, lines2, maxWidth, maxHeight);
  }

  var dataURL = canvas.toDataURL();
  canvasImage.src = dataURL;
  canvasImage.className = "";
}

function drawRect(context, x, y, clr) {
  context.fillStyle = clr;
  context.fillRect(
    x * SQUARE_SIZE + SQUARE_BORDER,
    y * SQUARE_SIZE + SQUARE_BORDER,
    SQUARE_SIZE - SQUARE_BORDER * 2,
    SQUARE_SIZE - SQUARE_BORDER * 2
  );
}

function trim(s, mask) {
  while (~mask.indexOf(s[0])) {
    s = s.slice(1);
  }
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1);
  }
  return s;
}
