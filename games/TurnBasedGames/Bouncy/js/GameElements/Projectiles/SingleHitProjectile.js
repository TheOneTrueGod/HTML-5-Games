class SingleHitProjectile extends Projectile {
  hitUnit(boardState, unit, intersection) {
    EffectFactory.createDamageEffect(boardState, intersection);

    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );

    this.readyToDel = true;
  }
}
