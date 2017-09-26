class ZoneEffect extends Unit {
  constructor(x, y, owner, id, creatorAbilityID, owningPlayerID) {
    super(x, y, owner, id);
    this.timeLeft = 3; // Placeholder.  Will replace in a bit.
    this.DELETION_PHASE = TurnPhasesEnum.ENEMY_SPAWN;
    this.SPRITE = null;
    this.health = {max: health, current: health};
    this.owningPlayerID = owningPlayerID;
    if (creatorAbilityID !== undefined) {
      this.setCreatorAbility(creatorAbilityID);
      var health = this.creatorAbility.getOptionalParam('zone_health', this.health);
      if (health instanceof Function) { health = health(); }
      this.health = {max: health, current: health};
      var duration = this.creatorAbility.getOptionalParam('duration', 3);
      this.timeLeft = {current: duration, max: duration};
    }

    this.createCollisionBox();
  }

  addStatusEffect(effect) { /* Zones are immune */ }

  playSpawnEffect(boardState, castPoint, time) {
    this.spawnEffectStart = {x: castPoint.x, y: castPoint.y};
    this.spawnEffectTime = {current: 0, max: time};
    this.moveTarget = {x: this.x, y: this.y};
    this.playSpawnEffectAtPct(boardState, 0);
  }

  playSpawnEffectAtPct(boardState, pct) {
    this.gameSprite.scale.x = lerp(0, 1, pct);
    this.gameSprite.scale.y = lerp(0, 1, pct);
    this.x = lerp(this.spawnEffectStart.x, this.moveTarget.x, pct);
    this.y = lerp(this.spawnEffectStart.y, this.moveTarget.y, pct);
  }

  runTick(boardState) {
    if (this.moveTarget && this.spawnEffectStart) {
      this.spawnEffectTime.current += 1;
      var pct = this.spawnEffectTime.current / this.spawnEffectTime.max;
      if (pct > 1) {
        pct = 1;
      }
      this.playSpawnEffectAtPct(boardState, pct);

      if (pct == 1) {
        this.moveTarget = null;
        this.spawnEffectStart = null;
        this.spawnEffectTime = null;
      }
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  hitsEnemyProjectiles() {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);
    return idx(projectileInteraction, "hits_enemy_projectiles", false);
  }

  hitsPlayerProjectiles() {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);
    return idx(projectileInteraction, "hits_player_projectiles", false);
  }

  canProjectileHit(projectile) {
    if (this.readyToDelete()) {
      return false;
    }
    if (projectile instanceof EnemyProjectile) {
       if (!this.hitsEnemyProjectiles()) { return false; }
    } else if (projectile instanceof Projectile) {
      if (!this.hitsPlayerProjectiles()) { return false; }
    }
    return true;
  }

  triggerHit(boardState, unit, intersection, projectile) {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction.destroy) {
      this.decreaseTime(boardState, 1);
      this.createHealthBarSprite(this.gameSprite);
      projectile.readyToDel = true;
    }
  }

  createCollisionBox() {
    if (!this.creatorAbility) { return; }
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction) {
      var l = -((this.size.left + 0.5) * this.physicsWidth);
      var r = ((this.size.right + 0.5) * this.physicsWidth);
      var t = -((this.size.top + 0.5) * this.physicsHeight);
      var b = ((this.size.bottom + 0.5) * this.physicsHeight);

      var lineType = UnitLine;
      if (projectileInteraction.force_bounce) {
        lineType = BouncingLine;
      }
      if (projectileInteraction.destroy) {
        lineType = AbilityTriggeringLine;
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

    this.SPRITE = this.creatorAbility.getOptionalParam('sprite', this.SPRITE);
    this.DELETION_PHASE = this.creatorAbility.getOptionalParam(
      'deletion_phase', this.DELETION_PHASE);

    this.createCollisionBox();
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
      this.onTimeOut(boardState);
    }
    this.createHealthBarSprite(this.gameSprite);
  }

  onTimeOut(boardState) {

  }

  createSprite() {
    var sprite;
    if (this.SPRITE) {
      if (
        this.SPRITE instanceof Object &&
        this.SPRITE.texture !== undefined &&
        this.SPRITE.index !== undefined
      ) {
        sprite = new PIXI.Sprite(ImageLoader.getSquareTexture(this.SPRITE.texture,
          this.SPRITE.index
        ));
        sprite.anchor.set(0.5);
      } else {
        sprite = new PIXI.Sprite(
          PIXI.loader.resources[this.SPRITE].texture
        );
        sprite.anchor.set(0.5);
      }
    } else {
      sprite = new PIXI.Graphics();
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
        fontWeight: 'bold',
        fontSize: fontSize + 'px',
        fontFamily: 'sans-serif',

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
      'creator_id': this.creatorAbility.index,
      'owning_player_id': this.owningPlayerID,
    };
  }

  loadSerializedData(data) {
    this.timeLeft = data.duration;
    this.setCreatorAbility(data.creator_id);
    this.owningPlayerID = data.owning_player_id;
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
