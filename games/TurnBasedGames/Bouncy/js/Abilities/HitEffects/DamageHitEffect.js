class DamageHitEffect extends HitEffect {
  doHitEffect(boardState, unit, intersection, projectile) {
    var is_penetrate = this.abilityDef.getContactEffect() == ProjectileShape.ContactEffects.PENETRATE;
    var base_damage = idx(this.hitEffectDef, 'base_damage', 100);
    if (is_penetrate) {
      base_damage = base_damage - projectile.damageDealt;
    }
    var finalDamage = base_damage;
    unit.dealDamage(boardState, finalDamage);
    if (is_penetrate && !unit.readyToDelete()) {
      projectile.readyToDel = true;
    }
  }
}
