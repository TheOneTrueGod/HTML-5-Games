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

  createHealthBarSprite(sprite) {
    // TODO:  If you're seeing some slowdown, there's probably a better way of doing this.
    if (this.healthBarSprites.textSprite) {
      this.gameSprite.removeChild(this.healthBarSprites.textSprite);
    }
    if (this.health.current <= 0) { return; }
    var healthPct = this.health.current / Math.max(this.health.max, 1);
    var fontSize = 14;// + Math.floor(healthPct) * 6;
    var healthBarGraphic = new PIXI.Text(
      this.health.current,
      {
        font : 'bold ' + fontSize + 'px sans-serif',
        fill : 0xff1010,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );
    healthBarGraphic.anchor.set(0.5);
    healthBarGraphic.position.set(0, 0);
    sprite.addChild(healthBarGraphic);

    this.healthBarSprites.textSprite = healthBarGraphic;
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_diamond_red'].texture
    );

    this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

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
      for (var i = -2; i <= 2; i++) {
        var angle = -Math.PI / 2.0 + Math.PI / 8.0 * i;
        var x = this.x;
        var y = this.y + this.physicsHeight / 2.0;
        boardState.addProjectile(
          new LineEffect(Line(
            x + Math.cos(angle) * 10,
            y + Math.sin(angle) * 10,
            x + Math.cos(angle) * 25,
            y + Math.sin(angle) * 25
          ),
          0xFF0000,
          {x: Math.cos(angle), y: Math.sin(angle)}
          )
        );
      }
    }
  }
}

UnitBasic.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBasic.AddToTypeMap();
