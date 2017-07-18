class Projectile {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 8;
    this.gameSprite = null;
    this.readyToDel = false;
  }

  runTick(boardState, boardWidth, boardHeight) {
    var self = this;
    var walls = boardState.getGameWalls();
    var unitsNearStart = boardState.sectors.getUnitsAtPosition(this.x, this.y);
    var unitsNearEnd = boardState.sectors.getUnitsAtPosition(
      this.x + Math.cos(this.angle) * this.speed,
      this.y + Math.sin(this.angle) * this.speed
    );
    var allUnits = deduplicate(unitsNearStart.concat(unitsNearEnd));
    allUnits.forEach((unitID) => {
      var unit = boardState.findUnit(unitID);
      var collisionBox = unit.getCollisionBox();
      for (var i = 0; i < collisionBox.length; i++) {
        walls.push(collisionBox[i]);
      }
    });
    var reflections = Physics.doLineReflections(
      this.x, this.y, this.angle, this.speed, walls,
      (intersection) => {
        if (intersection.line.unit) {
          self.hitUnit(boardState, intersection.line.unit, intersection);
        }
      }
    );
    var endPoint = reflections[reflections.length - 1];
    this.x = endPoint.x2;
    this.y = endPoint.y2;
    this.angle = endPoint.getVector().horizontalAngle();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    if (this.x <= 0 || this.x > boardWidth || this.y < 0 || this.y > boardHeight) {
      this.readyToDel = true;
    }
  }

  hitUnit(boardState, unit, intersection) {
    if (intersection.line) {
      boardState.addProjectile(
        new LineEffect(intersection.line)
      );
    }
    unit.dealDamage(1);
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
