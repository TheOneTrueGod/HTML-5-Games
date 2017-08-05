class HitEffect {
  constructor(hitEffectDef, abilityDef) {
    this.hitEffectDef = hitEffectDef;
    this.abilityDef = abilityDef;
  }

  doHitEffect(boardState, unit, intersection, projectile) {
    console.log("Hit Effect!");
  }
}

HitEffect.getHitEffectFromType = function(hitEffectDef, abilityDef, projectileShape) {
  switch(hitEffectDef.effect) {
    case ProjectileShape.HitEffects.POISON:
      return new PoisonHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.DAMAGE:
      return new DamageHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.FREEZE:
      return new FreezeHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.BULLET_SPLIT:
    return new BulletSplitHitEffect(hitEffectDef, abilityDef, projectileShape);
  }
  return new HitEffect(hitEffectDef, abilityDef);
}
