class UnitCore extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    return new PIXI.Sprite(
      PIXI.loader.resources['core'].texture
    );
  }

  runTick() {
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitCore.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitCore.AddToTypeMap();
