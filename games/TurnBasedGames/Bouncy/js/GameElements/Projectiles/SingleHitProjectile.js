class SingleHitProjectile extends Projectile {
  hitUnit(boardState, unit, intersection) {
    this.unitHitCallback && this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );

    if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }

    this.readyToDel = true;
  }
}
