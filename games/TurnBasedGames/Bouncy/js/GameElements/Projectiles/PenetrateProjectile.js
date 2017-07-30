class PenetrateProjectile extends Projectile {
  constructor(startPoint, angle, unitHitCallback, maxDamage) {
    super(startPoint, angle, unitHitCallback);
    this.maxDamage = maxDamage;
  }

  hitUnit(boardState, unit, intersection) {
    if (intersection.line) {
      var collisionBox = unit.getCollisionBox();
      for (var i = 0; i < collisionBox.length; i++) {
        boardState.addProjectile(new LineEffect(collisionBox[i]));
      }
    }
    var damageDealt = this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    this.maxDamage -= damageDealt;
    if (this.maxDamage <= 0) {
      this.readyToDel = true;
    }
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return true;
    }
    return false;
  }
}
