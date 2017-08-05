class FreezeHitEffect extends HitEffect {
  doHitEffect(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new FreezeStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
      )
    );
  }
}
