class Projectile {
  constructor(startPoint, targetPoint, angle, projectileOptions) {
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.angle = angle;
    this.speed = idx(projectileOptions, 'speed', 8);
    this.size = idx(projectileOptions, 'size', 5);
    this.trailLength = idx(projectileOptions, 'trail_length', 5);
    this.gravity = idx(projectileOptions, 'gravity', null);
    this.speedDecay = idx(projectileOptions, 'speed_decay', null);
    this.destroyOnWall = idx(projectileOptions, 'destroy_on_wall', false);
    if (this.gravity) { this.gravity = Victor(this.gravity.x, this.gravity.y); }
    if (this.speedDecay) { this.speedDecay = Victor(this.speedDecay.x, this.speedDecay.y); }
    this.gameSprite = null;
    this.readyToDel = false;
    this.unitHitCallback = null;
    this.timeoutCallback = null;
    this.duration = -1;
    if (projectileOptions && projectileOptions.hit_effects) {
      this.hitEffects = projectileOptions.hit_effects;
    }
  }

  addUnitHitCallback(unitHitCallback) {
    this.unitHitCallback = unitHitCallback;
    return this;
  }

  addTimeoutCallback(timeoutCallback) {
    this.timeoutCallback = timeoutCallback;
    return this;
  }

  findCollisionBoxesForLine(boardState, line) {
    var walls = boardState.getGameWalls();

    var allUnits = boardState.sectors.getUnitsInSquare(line);
    allUnits.forEach((unitID) => {
      var unit = boardState.findUnit(unitID);
      var collisionBox = unit.getCollisionBox();
      for (var i = 0; i < collisionBox.length; i++) {
        walls.push(collisionBox[i]);
      }
    });
    return walls;
  }

  createTrail(boardState) {
    if (boardState.tick % 1 == 0) {
      boardState.addProjectile(
        new ProjectileTrailEffect(this, this.trailLength)
      );
    }
  }

  runTick(boardState, boardWidth, boardHeight) {
    var self = this;

    if (this.duration !== -1) {
      this.duration -= 1;
      if (this.duration <= 0) {
        this.readyToDel = true;
        if (this.timeoutCallback) {
          this.timeoutCallback(boardState, this);
        }
      }
    }

    var speed = Victor(Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed);
    if (this.speedDecay) {
      speed.multiply(this.speedDecay);
    }
    if (this.gravity) {
      speed.add(this.gravity);
    }

    this.angle = speed.angle();
    this.speed = speed.length();

    this.createTrail(boardState);

    var reflectionResult = Physics.doLineReflections(
      this.x, this.y, this.angle, this.speed * MainGame.DEBUG_SPEED,
      this.findCollisionBoxesForLine.bind(this, boardState),
      (intersection) => {
        if (intersection.line.unit && !this.readyToDelete()) {
          self.hitUnit(boardState, intersection.line.unit, intersection);
        }
        if (intersection.line instanceof BorderWallLine) {
          self.hitWall(boardState, intersection);
        }
      },
      this.shouldBounceOffLine.bind(this)
    );

    for (var i = 0; i < reflectionResult.intersections.length; i++) {
      var intersection = reflectionResult.intersections[i];
      if (intersection.line.unit && !this.readyToDelete()) {
        self.hitUnit(boardState, intersection.line.unit, intersection);
      }
      if (intersection.line instanceof BorderWallLine) {
        self.hitWall(boardState, intersection);
      }
    }

    var endPoint = reflectionResult.reflection_lines[
      reflectionResult.reflection_lines.length - 1
    ];
    this.x = endPoint.x2;
    this.y = endPoint.y2;
    this.angle = endPoint.getVector().horizontalAngle();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    if (this.x <= 0 || this.x > boardWidth || this.y < 0 || this.y > boardHeight) {
      this.readyToDel = true;
    }
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {

    }
    return true;
  }

  hitUnit(boardState, unit, intersection) {
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }

  hitWall(boardState, intersection) {
    if (this.destroyOnWall) { this.readyToDel = true; }
  }

  readyToDelete() {
    return this.readyToDel;
  }

  createSprite() {
    var sprite = new PIXI.Graphics();
    sprite.position.set(this.x, this.y);
    sprite.beginFill(0xffffff);
    sprite.drawCircle(0, 0, this.size);
    return sprite;
  }

  addToStage(stage) {
    if (!this.gameSprite) {
      this.gameSprite = this.createSprite();
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }

  removeFromStage(stage) {
    stage.removeChild(this.gameSprite);
  }
}

Projectile.createProjectile = function(
  contactEffect, startPoint, targetPoint, angle, abilityDef, projectileOptions
) {
  switch (contactEffect) {
    case ProjectileShape.ContactEffects.BOUNCE:
      return new BouncingProjectile(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ContactEffects.HIT:
      return new SingleHitProjectile(startPoint, targetPoint, angle, projectileOptions);
    case ProjectileShape.ContactEffects.AOE_EFFECT:
      return new AoEHitProjectile(startPoint, targetPoint, angle,
        abilityDef.getOptionalParam("radius", 50), projectileOptions);
    case ProjectileShape.ContactEffects.PENETRATE:
      return new PenetrateProjectile(startPoint, targetPoint, angle, projectileOptions);
    case ProjectileShape.ContactEffects.PASSTHROUGH:
      return new PassthroughProjectile(startPoint, targetPoint, angle,
        abilityDef.getOptionalParam("num_hits", 5), projectileOptions);
    case ProjectileShape.ContactEffects.TIMEOUT:
      return new TimeoutProjectile(startPoint, targetPoint, angle, projectileOptions);
  }
  throw new Error("contactEffect [" + contactEffect + "] not handled");
}
