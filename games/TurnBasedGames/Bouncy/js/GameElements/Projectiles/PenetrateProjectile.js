class PenetrateProjectile extends Projectile {
  constructor(startPoint, angle, unitHitCallback, maxDamage, projectileOptions) {
    super(startPoint, angle, unitHitCallback, projectileOptions);
    this.maxDamage = maxDamage;
    this.damageDealt = 0;
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
    this.damageDealt += damageDealt;
    if (this.maxDamage <= 0) {
      this.readyToDel = true;
    }
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return true;
    }
    return super.shouldBounceOffLine(line);
  }
}
