class PenetrateProjectile extends Projectile {
  constructor(startPoint, angle, unitHitCallback, projectileOptions) {
    super(startPoint, angle, unitHitCallback, projectileOptions);
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
    this.damageDealt += damageDealt;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return true;
    }
    return false;
    //return super.shouldBounceOffLine(line);
  }
}
