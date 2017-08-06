class DamageHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    var is_penetrate = this.abilityDef.getContactEffect() == ProjectileShape.ContactEffects.PENETRATE;
    var base_damage = idx(this.hitEffectDef, 'base_damage', 100);
    var pctBased = false;
    if (typeof base_damage == "string" && base_damage.substring(base_damage.length - 1) === "%") {
      var pct = base_damage.substring(0, base_damage.length - 1);
      base_damage = unit.health.current * pct / 100;
      var pctBased = true;
    }
    if (is_penetrate) {
      base_damage = base_damage - projectile.damageDealt;
    }
    var finalDamage = base_damage;
    var damageDealt = unit.dealDamage(boardState, finalDamage);
    if (is_penetrate && !unit.readyToDelete()) {
      projectile.readyToDel = true;
    }
    return damageDealt;
  }
}

DamageHitEffect.createJSON = function(
  baseDamage,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.DAMAGE,
    'base_damage': baseDamage
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
