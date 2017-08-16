class TimeoutProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, projectileOptions) {
    super(startPoint, targetPoint, angle, projectileOptions);
    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.duration = Math.max(targetVec.length(), 100) / this.speed;
  }

  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );

    if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }

    this.delete();
  }
}
