const CANVAS_WIDTH = 720;

const SPELL_CARD_WIDTH = 200;
const SPELL_CARD_HEIGHT = 200;
const CARD_PADDING = 10;

$(document).ready(function() {
  $('#goButton').on('click', function() {
    var cardList = $('#inputDiv').val().split("\n");

    cardList = [
      'Fire-1\t-\t1\tR\tDeal [H] damage to 1 target\tX\tThe first ability deals +1 damage this turn',
      'Fire-2\t-\t2\tR\tDeal [H] damage to 1 target\tX\tThe first ability deals +1 damage this turn',
      'Fire-3\tFire-Offense-2\t3\tRR\tDeal [H] damage to 1 target\tX\tThe first ability deals +1 damage this turn',
      'Ice-Offense-1\t-\t1\tB\tDeal [M] damage to 1 target.  Exhaust it.\t\t',
    ];

    var canvas;

    var spellFunc = null;
    var cardClass = null;
    var cardHeight = 0;
    var cardsPerRow = 1;
    switch ($("input[type='radio'][name='cardType']:checked").val()) {
      case "spell":
        spellFunc = drawSpellOnCanvas;
        cardHeight = SPELL_CARD_HEIGHT;
        cardsPerRow = Math.floor(CANVAS_WIDTH / (SPELL_CARD_WIDTH + CARD_PADDING));
        cardClass = SpellCardData;
      break;
      case "enemy":
        spellFunc = drawEnemyOnCanvas;
      break;
      default:
        throw new Exception("Invalid card type selected");
        break;
    }

    var cardDataList = [];
    for (var i = 0; i < cardList.length; i++) {
      var cardData = cardList[i].split("\t");
      var card = new cardClass(cardData);
      cardDataList.push(card);
    }

    canvas = createNewCanvas(
      CANVAS_WIDTH,
      Math.ceil(cardList.length / cardsPerRow) * (cardHeight + CARD_PADDING)
    );

    for (var i = 0; i < cardDataList.length; i++) {
      spellFunc(cardDataList[i], canvas, i)
    }
  });
  $('#goButton').click();
});

function createNewCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  $('#outputDiv').empty().append(canvas);

  return canvas;
}

function drawSpellOnCanvas(cardData, mainCanvas, id) {
  var cardsPerRow = Math.floor(CANVAS_WIDTH / (SPELL_CARD_WIDTH + CARD_PADDING));

  var cardCanvas = document.createElement('canvas');
  cardCanvas.width = SPELL_CARD_WIDTH;
  cardCanvas.height = SPELL_CARD_HEIGHT;

  // Card Border
  var ctx = cardCanvas.getContext("2d");
  ctx.beginPath();
  ctx.rect(0, 0, SPELL_CARD_WIDTH, SPELL_CARD_HEIGHT);

  const TITLE_FONT_SIZE = 20;
  const IMAGE_HEIGHT = SPELL_CARD_HEIGHT * 0.4

  // Image
  ctx.rect(SPELL_CARD_WIDTH / 6, TITLE_FONT_SIZE + 8, 4 * SPELL_CARD_WIDTH / 6, IMAGE_HEIGHT);

  // Title
  ctx.font = TITLE_FONT_SIZE + 'px serif';
  var text = ctx.measureText(cardData.getName());
  ctx.fillStyle = 'white';
  ctx.fillRect(SPELL_CARD_WIDTH / 2 - text.width / 2 - 10, 3, text.width + 20, TITLE_FONT_SIZE + 3);
  ctx.fillStyle = "black";
  ctx.rect(SPELL_CARD_WIDTH / 2 - text.width / 2 - 10, 3, text.width + 20, TITLE_FONT_SIZE + 3);
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fillText(cardData.getName(), SPELL_CARD_WIDTH / 2 - text.width / 2, TITLE_FONT_SIZE);

  const ABILITY_TOP = TITLE_FONT_SIZE + 8 + IMAGE_HEIGHT + 5;
  const ABILITY_HEIGHT = SPELL_CARD_HEIGHT - (TITLE_FONT_SIZE + 8 + IMAGE_HEIGHT + 10);
  const COST_WIDTH = 30;
  const ABILITY_WIDTH = SPELL_CARD_WIDTH - COST_WIDTH;

  // Abilities
  ctx.rect(5, ABILITY_TOP, SPELL_CARD_WIDTH - 10, ABILITY_HEIGHT);
  ctx.stroke();

  var abilityCost = cardData.getFirstAbilityCost();
  var textLeft = 0;
  if (abilityCost) {
    ctx.font = '16px serif';
    ctx.fillText(abilityCost, 10, ABILITY_TOP + ABILITY_HEIGHT / 4);
    textLeft += COST_WIDTH;
  }
  drawMultiLineText(ctx, cardData.getFirstAbility(), 12, 10 + textLeft, ABILITY_TOP + 12, ABILITY_WIDTH - textLeft);

  if (cardData.hasSecondAbility()) {
    ctx.beginPath()
    ctx.moveTo(5, ABILITY_TOP + ABILITY_HEIGHT / 2);
    ctx.lineTo(SPELL_CARD_WIDTH - 5, ABILITY_TOP + ABILITY_HEIGHT / 2);
    ctx.stroke();

    abilityCost = cardData.getSecondAbilityCost();
    textLeft = 0;
    if (abilityCost) {
      ctx.font = '16px serif';
      ctx.fillText(abilityCost, 10, ABILITY_TOP + 3 * ABILITY_HEIGHT / 4);
      textLeft += COST_WIDTH;
    }
    drawMultiLineText(ctx, cardData.getSecondAbility(), 12, 10 + textLeft, ABILITY_TOP + 12 + ABILITY_HEIGHT / 2, ABILITY_WIDTH - textLeft);
  }

  // Add to original canvas
  var ctx = mainCanvas.getContext("2d");
  ctx.drawImage(
    cardCanvas,
    (id % cardsPerRow) * (SPELL_CARD_WIDTH + CARD_PADDING) + CARD_PADDING * 0.5,
    Math.floor(id / cardsPerRow) * (SPELL_CARD_HEIGHT + CARD_PADDING) + CARD_PADDING * 0.5
  );
};

function drawMultiLineText(ctx, text, fontSize, x, y, width) {
  ctx.font = fontSize + 'px serif';

  var splitText = text.split(" ");
  var line = "";
  var index = 0;
  while (index < splitText.length) {
    if (!line) {
      line = splitText[index];
    } else {
      var text = ctx.measureText(line + " " + splitText[index]);
      if (text.width >= width) {
        ctx.fillText(line, x, y);
        y += fontSize;
        line = splitText[index];
      } else {
        line += " " + splitText[index];
      }
    }
    index ++;
  }
  ctx.fillText(line, x, y);
}

function drawEnemyOnCanvas(cardData, id) {

};

class SpellCardData {
  constructor(cardData) {
    this.cardData = cardData;
  }

  getName() {
    return this.cardData[0];
  }

  getFirstAbilityCost() {
    return this.cardData[3];
  }

  getSecondAbilityCost() {
    return this.cardData[5];
  }

  getFirstAbility() {
    return this.cardData[4];
  }

  getSecondAbility() {
    return this.cardData[6];
  }

  hasSecondAbility() {
    return this.cardData[6] !== '';
  }
}
