class Unit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.gameSprite = null;
  }

  serialize() {
    return {
      'x': this.x,
      'y': this.y,
    };
  }

  addToStage(stage) {
    this.gameSprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
    stage.addChild(this.gameSprite);
  }

  runTick() {
    this.y += 1;

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

Unit.loadFromServerData = function(serverData) {
  var x = 0;
  var y = 0;
  if (serverData.x) { x = serverData.x; }
  if (serverData.y) { y = serverData.y; }
  var unit = new Unit(x, y);
  return unit;
}
