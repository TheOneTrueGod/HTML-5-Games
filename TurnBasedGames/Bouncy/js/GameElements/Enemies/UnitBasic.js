class UnitBasic extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    this.collisionBox = [
      Line(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0), // Top Right
      Line(this.physicsWidth / 2, 0, 0, this.physicsHeight / 2), // Bottom Right
      Line(0, this.physicsHeight / 2, -this.physicsWidth / 2, 0), // Bottom Left
      Line(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2), // Top Left
    ];
  }

  addPhysicsLines(sprite) {
    for (var i = 0; i < this.collisionBox.length; i++) {
      var lineGraphic = new PIXI.Graphics();
      var line = this.collisionBox[i];
      lineGraphic.position.set(line.x1, line.y1);
      lineGraphic.lineStyle(3, 0xff0000)
             .moveTo(0, 0)
             .lineTo(line.x2 - line.x1, line.y2 - line.y1);
      sprite.addChild(lineGraphic);
    }
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_diamond_red'].texture
    );

    this.addPhysicsLines(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }

  doMovement(boardState) {
    boardState.sectors.removeUnit(this);
    this.setMoveTarget(this.x, this.y + this.physicsHeight);
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

    if (this.y >= boardState.getUnitThreshold()) {
      this.readyToDel = true;
      boardState.dealDamage(this.damage);
    }
  }
}

UnitBasic.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBasic.AddToTypeMap();
