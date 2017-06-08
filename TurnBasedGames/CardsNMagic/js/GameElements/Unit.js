class Unit {
  constructor(x, y, owner, id) {
    this.x = x;
    this.y = y;
    this.gameSprite = null;
    this.owner = owner;
    if (!id) {
      this.id = MainGame.boardState.getUnitID();
    } else {
      this.id = id;
    }
  }

  serialize() {
    var serialized = {
      'x': this.x,
      'y': this.y,
      'unitType': this.constructor.name,
      'owner': this.owner,
      'id': this.id,
    };
    return serialized;
  }

  createSprite() {
    return new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();

    this.gameSprite.x = this.x - this.gameSprite.width / 2;
    this.gameSprite.y = this.y - this.gameSprite.height / 2;

    stage.addChild(this.gameSprite);
  }

  runTick() {
    this.y += 1;

    this.gameSprite.x = this.x - this.gameSprite.width / 2;
    this.gameSprite.y = this.y - this.gameSprite.height / 2;
  }

  getSelectionRadius() { return 20; }
}

Unit.loadFromServerData = function(serverData) {
  var x = 0;
  var y = 0;
  var owner = 0;
  var UnitClass = Unit;
  var id = null;
  if (serverData.x) { x = serverData.x; }
  if (serverData.y) { y = serverData.y; }
  if (serverData.owner) { owner = serverData.owner; }
  if (serverData.unitType) {
    if (!(serverData.unitType in Unit.UnitTypeMap)) {
      alert(serverData.unitType + " not in Unit.UnitTypeMap.");
    } else {
      UnitClass = Unit.UnitTypeMap[serverData.unitType];
    }
  }
  if (serverData.id) { id = serverData.id; }
  var unit = new UnitClass(x, y, owner, id);
  return unit;
}

Unit.UnitTypeMap = {
};
Unit.AddToTypeMap = function() {
  Unit.UnitTypeMap[this.name] = this;
}
