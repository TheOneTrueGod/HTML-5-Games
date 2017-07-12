class UnitBit extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    var sprite;
    switch (this.owner) {
      case 0:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte_red'].texture
        );
        break;
      case 1:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
        break;
      default:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
        break;
    }

    sprite.anchor.set(0.5);
    return sprite;
  }

  doMovement(boardState) {
    boardState.sectors.removeUnit(this);
    this.setMoveTarget(this.x, this.y + 40);
    boardState.sectors.addUnit(this);
  }

  runTick(boardState) {
    if (this.moveTarget === null) {
      return;
    }
    var moveSpeed = 2;
    var targ = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
    if (targ.length() <= moveSpeed) {
      this.x = this.moveTarget.x;
      this.y = this.moveTarget.y;
      this.moveTarget = null;
    } else {
      targ.normalize().multiplyScalar(moveSpeed);
      this.x += targ.x;
      this.y += targ.y;
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitBit.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBit.AddToTypeMap();
