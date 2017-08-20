class UnitBasic extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    this.movementCredits = 0;
    this.movementSpeed = NumbersBalancer.getUnitSpeed(this);
    this.damage = NumbersBalancer.getUnitDamage(this);
    this.createCollisionBox();
  }

  createCollisionBox() {
    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(this.physicsWidth / 2, 0, 0, this.physicsHeight / 2, this), // Bottom Right
      new UnitLine(0, this.physicsHeight / 2, -this.physicsWidth / 2, 0, this), // Bottom Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  addEffectSprite(effect) {
    if (!this.gameSprite) {
      return;
    }
    var sprite = null;
    if (effect == FreezeStatusEffect.getEffectType()) {
      sprite = new PIXI.Graphics();
      sprite.position.set(-this.physicsWidth / 2, -this.physicsHeight / 2);
      sprite.lineStyle(3, 0x0000FF)
         .moveTo(0, 0)
         .lineTo(this.physicsWidth, this.physicsHeight)
         .moveTo(this.physicsWidth, 0)
         .lineTo(0, this.physicsHeight)
         .moveTo(0, 0)
         .lineTo(this.physicsWidth, 0)
         .lineTo(this.physicsWidth, this.physicsHeight)
         .lineTo(0, this.physicsHeight)
         .lineTo(0, 0);
      this.gameSprite.addChildAt(sprite, this.gameSprite.children.length - 1);
    } else if (effect == PoisonStatusEffect.getEffectType()) {
      sprite = new PIXI.Graphics();
      sprite.position.set(0, 0);
      var color = 0x00AA00;
      var alpha = 0.5;
      sprite.lineStyle(3, color, alpha)
        .beginFill(color, alpha);

      var path = [];
      for (var i = 0; i < this.collisionBox.length; i++) {
        path.push(new PIXI.Point(this.collisionBox[i].x1, this.collisionBox[i].y1));
      }

      sprite.drawPolygon(path);
      this.gameSprite.addChildAt(sprite, 0);
    }
    if (sprite) {

      this.effectSprites[effect] = sprite;
      //this.healthBarSprites.textSprite.bringToFront();
    }
  }

  serializeData() {
    return {
      'movement_credits': this.movementCredits
    };
  }

  loadSerializedData(data) {
    this.movementCredits = data.movement_credits;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  addPhysicsLines(sprite, color) {
    color = color ? color : 0xff0000;
    for (var i = 0; i < this.collisionBox.length; i++) {
      var lineGraphic = new PIXI.Graphics();
      var line = this.collisionBox[i];
      lineGraphic.position.set(line.x1, line.y1);
      lineGraphic.lineStyle(3, color)
             .moveTo(0, 0)
             .lineTo(line.x2 - line.x1, line.y2 - line.y1);
      sprite.addChild(lineGraphic);
    }
  }

  createHealthBarSprite(sprite) {
    // TODO:  If you're seeing some slowdown, there's probably a better way of doing this.
    if (this.healthBarSprites.textSprite) {
      this.gameSprite.removeChild(this.healthBarSprites.textSprite);
      this.healthBarSprites.textSprite = null;
    }
    if (this.health.current <= 0) { return; }
    var healthPct = this.health.current / Math.max(this.health.max, 1);
    var fontSize = 10;// + Math.floor(healthPct) * 6;
    var healthBarGraphic = new PIXI.Text(
      this.health.current,
      {
        font : 'bold ' + fontSize + 'px sans-serif',
        fill : 0xFFFFFF,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );
    healthBarGraphic.anchor.set(0.5);
    healthBarGraphic.position.set(0, 20);
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
    for (var effect in this.statusEffects) {
      this.addEffectSprite(this.statusEffects[effect].getEffectType());
    }
    return sprite;
  }

  doMovement(boardState) {
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits < 1) { return; }
    while (this.movementCredits >= 1) {
      var currPos = this.getCurrentPosition();
      var targetPos = {x: currPos.x, y: currPos.y + this.physicsHeight};
      var canEnter =
        boardState.sectors.canUnitEnter(boardState, this, targetPos) &&
        boardState.unitEntering(this, targetPos);

      if (canEnter) {
        boardState.sectors.removeUnit(this);
        this.setMoveTarget(targetPos.x, targetPos.y);
        boardState.sectors.addUnit(this);
        this.movementCredits -= 1;
      } else {
        this.movementCredits = Math.min(Math.max(0, 1 - this.movementSpeed), this.movementCredits);
      }
    }
  }

  getMoveSpeed() {
    return 2;
  }

  runTick(boardState) {
    if (this.moveTarget === null) {
      return;
    }
    var moveSpeed = this.getMoveSpeed();
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
      EffectFactory.createDamagePlayersEffect(
        boardState,
        this.x,
        this.y + this.physicsHeight / 2.0,
      );
    }
  }

  onDelete(boardState) {

  }
}

UnitBasic.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBasic.AddToTypeMap();
