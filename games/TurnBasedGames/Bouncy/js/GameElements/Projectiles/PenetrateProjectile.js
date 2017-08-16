class PenetrateProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, projectileOptions) {
    super(startPoint, targetPoint, angle, projectileOptions);
    this.damageDealt = 0;
  }

  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    EffectFactory.createDamageEntireUnitEffect(boardState, unit);

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
