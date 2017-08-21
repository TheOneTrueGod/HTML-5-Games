class PassthroughProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, hitsLeft, projectileOptions) {
    super(startPoint, targetPoint, angle, projectileOptions);
    this.hitsLeft = hitsLeft ? hitsLeft : 5;
  }

  hitUnit(boardState, unit, intersection) {
    if (this.lastHitUnit) {
      if (this.lastHitUnit == unit.id) {
        return;
      }
    }
    super.hitUnit(boardState, unit, intersection);
    EffectFactory.createDamageEntireUnitEffect(boardState, unit)

    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    this.lastHitUnit = unit.id;
    this.hitsLeft -= 1;
    if (this.hitsLeft <= 0) {
      this.delete();
    }
  }

  hitWall(boardState, intersection) {
    this.lastHitUnit = null;
  }

  shouldBounceOffLine(line) {
    return line.forceBounce();
  }
}
