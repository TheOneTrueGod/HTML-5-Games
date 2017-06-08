class UnitBit extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    switch (this.owner) {
      case 0:
        return new PIXI.Sprite(
          PIXI.loader.resources['byte_red'].texture
        );
      case 1:
        return new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
      default:
        return new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
    }
  }

  runTick() {
    this.y += 1;

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitBit.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBit.AddToTypeMap();
