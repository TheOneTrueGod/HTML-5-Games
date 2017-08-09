class PassthroughProjectile extends Projectile {
  constructor(startPoint, angle, unitHitCallback, hitsLeft, projectileOptions) {
    super(startPoint, angle, unitHitCallback, projectileOptions);
    this.hitsLeft = hitsLeft ? hitsLeft : 5;
  }
  hitUnit(boardState, unit, intersection) {
    if (this.lastHitUnit) {
      if (this.lastHitUnit == unit.id) {
        return;
      }
    }
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
      this.readyToDel = true;
    }
  }

  hitWall(boardState, intersection) {
    this.lastHitUnit = null;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return true;
    }
    return super.shouldBounceOffLine(line);
  }
}
