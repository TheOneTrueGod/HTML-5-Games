class BouncingProjectile extends Projectile {
  hitUnit(boardState, unit, intersection) {
    if (intersection.line) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
  }
}
