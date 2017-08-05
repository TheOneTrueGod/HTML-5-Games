class PoisonHitEffect extends HitEffect {
  doHitEffect(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new PoisonStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
        idx(this.hitEffectDef, 'damage', 0),
        1.5 // Poison Effect Amount
      )
    );
  }
}
