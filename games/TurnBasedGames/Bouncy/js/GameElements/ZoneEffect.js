class ZoneEffect extends Unit {
  constructor(x, y, owner, id, creatorAbilityID) {
    super(x, y, owner, id);
    this.timeLeft = 3; // Placeholder.  Will replace in a bit.
    if (creatorAbilityID !== undefined) {
      this.setCreatorAbility(creatorAbilityID);
      var duration = this.creatorAbility.getOptionalParam('duration', 3);
      this.timeLeft = {current: duration, max: duration};
    }
    var health = this.creatorAbility.getOptionalParam('zone_health', 100);
    this.health = {max: health, current: health};
    this.SPRITE = this.creatorAbility.getOptionalParam('sprite', null);
    this.DELETION_PHASE = this.creatorAbility.getOptionalParam(
      'deletion_phase', TurnPhasesEnum.ENEMY_SPAWN);
    this.createCollisionBox();
  }

  createCollisionBox() {
    if (!this.creatorAbility) { return; }
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction) {
      var t = -this.physicsHeight / 2;
      var b = this.physicsHeight / 2;
      var r = this.physicsWidth / 2;
      var l = -this.physicsWidth / 2;

      var lineType = UnitLine;
      if (projectileInteraction.force_bounce) {
        lineType = BouncingLine;
      }

      var offset = 0;
      this.collisionBox = [
        new lineType(l - offset, t, r + offset, t, this), // Top
        new lineType(r, t - offset, r, b + offset, this), // Right
        new lineType(r + offset, b, l - offset, b, this), // Bottom
        new lineType(l, b + offset, l, t - offset, this), // Left
      ];
    }
  }

  getSize() {
    return {
      left: this.size.left, right: this.size.right,
      top: this.size.top, bottom: this.size.bottom
    };
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = this.creatorAbility.getZoneSize();
  }

  endOfPhase(boardState, phase) {
    super.endOfPhase(boardState, phase);
    if (phase === this.DELETION_PHASE) {
      this.decreaseTime(boardState, 1);
      this.createHealthBarSprite(this.gameSprite);
    }
  }

  decreaseTime(boardState, amount) {
    this.timeLeft.current -= amount;
    if (this.timeLeft.current <= 0) {
      this.readyToDel = true;
    }
    this.createHealthBarSprite(this.gameSprite);
  }

  createSprite() {
    if (this.SPRITE) {
      var sprite;
      sprite = new PIXI.Sprite(
        PIXI.loader.resources[this.SPRITE].texture
      );
      sprite.anchor.set(0.5);
    } else {
      var sprite = new PIXI.Graphics();
      sprite.position.set(this.x, this.y);
      sprite.lineStyle(5, 0x00AA00);
      var left = ((this.size.left + 0.5) * Unit.UNIT_SIZE);
      var right = ((this.size.right + 0.5) * Unit.UNIT_SIZE);
      var top = ((this.size.top + 0.5) * Unit.UNIT_SIZE);
      var bottom = ((this.size.bottom + 0.5) * Unit.UNIT_SIZE);
      sprite.drawRect(
        -left, -top,
        left + right, top + bottom
      );

      sprite.lineStyle(1, 0x00AA00);
      sprite.drawRect(
        -left + 8, -top + 8,
        left + right - 16, top + bottom - 16
      );
      this.createHealthBarSprite(sprite);
    }

    return sprite;
  }

  createHealthBarSprite(sprite) {
    // TODO:  If you're seeing some slowdown, there's probably a better way of doing this.
    if (this.healthBarSprites.textSprite) {
      this.gameSprite.removeChild(this.healthBarSprites.textSprite);
      this.healthBarSprites.textSprite = null;
    }
    if (this.health.current <= 0) { return; }
    var healthPct = this.timeLeft.current / Math.max(this.timeLeft.max, 1);
    var fontSize = 14;// + Math.floor(healthPct) * 6;
    var healthBarGraphic = new PIXI.Text(
      this.timeLeft.current,
      {
        font : 'bold ' + fontSize + 'px sans-serif',
        fill : 0x00AA00,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );
    healthBarGraphic.anchor.set(0.5);
    healthBarGraphic.position.set(
      (-this.size.left / 2 + this.size.right / 2) * Unit.UNIT_SIZE,
      (-this.size.top / 2 + this.size.bottom / 2) * Unit.UNIT_SIZE
    );
    sprite.addChild(healthBarGraphic);

    this.healthBarSprites.textSprite = healthBarGraphic;
  }

  serializeData() {
    return {
      'duration': this.timeLeft,
      'creator_id': this.creatorAbility.index
    };
  }

  loadSerializedData(data) {
    this.timeLeft = data.duration;
    this.setCreatorAbility(data.creator_id);
  }

  preventsUnitEntry(unit) {
    return false;
  }

  otherUnitEntering(boardState, unit) {
    this.creatorAbility.unitEnteringZone(boardState, unit, this);
    return this.creatorAbility.canUnitPassThrough(unit);
  }
}

ZoneEffect.AddToTypeMap();
