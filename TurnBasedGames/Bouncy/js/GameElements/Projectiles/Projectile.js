class Projectile {
  constructor(startPoint, angle, unitHitCallback) {
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.angle = angle;
    this.speed = 8;
    this.gameSprite = null;
    this.readyToDel = false;
    this.unitHitCallback = unitHitCallback;
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
        new ProjectileTrailEffect(this, 5)
      );
    }
  }

  runTick(boardState, boardWidth, boardHeight) {
    var self = this;

    this.createTrail();

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
    return true;
  }

  hitUnit(boardState, unit, intersection) {
    if (intersection.line) {
      boardState.addProjectile(
        new LineEffect(intersection.line)
      );
    }
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
  }

  hitWall(boardState, intersection) {

  }

  readyToDelete() {
    return this.readyToDel;
  }

  createSprite() {
    var sprite = new PIXI.Graphics();
    sprite.position.set(this.x, this.y);
    sprite.beginFill(0xffffff);
    sprite.drawCircle(0, 0, 5);
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
  contactEffect, startPoint, angle, unitHitCallback, abilityDef
) {
  switch (contactEffect) {
    case ProjectileShape.ContactEffects.BOUNCE:
      return new BouncingProjectile(startPoint, angle, unitHitCallback);
    case ProjectileShape.ContactEffects.HIT:
      return new SingleHitProjectile(startPoint, angle, unitHitCallback);
    case ProjectileShape.ContactEffects.AOE_EFFECT:
      return new AoEHitProjectile(startPoint, angle, unitHitCallback,
        abilityDef.getOptionalParam("radius", 50));
    case ProjectileShape.ContactEffects.PENETRATE:
      return new PenetrateProjectile(startPoint, angle, unitHitCallback,
        abilityDef.getOptionalParam("base_damage", 50));
    case ProjectileShape.ContactEffects.PASSTHROUGH:
      return new PassthroughProjectile(startPoint, angle, unitHitCallback,
        abilityDef.getOptionalParam("num_hits", 5));
  }
  throw new Error("contactEffect [" + contactEffect + "] not handled");
}
