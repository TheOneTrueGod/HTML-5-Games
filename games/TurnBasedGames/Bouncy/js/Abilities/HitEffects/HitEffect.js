class HitEffect {
  constructor(hitEffectDef, abilityDef) {
    this.hitEffectDef = hitEffectDef;
    this.abilityDef = abilityDef;
  }

  doHitEffect(boardState, unit, intersection, projectile) {
    if (intersection && intersection.line instanceof AbilityTriggeringLine) {
      intersection.line.triggerHit(boardState, unit, intersection, projectile);
    }
    var AOEType = idx(this.hitEffectDef, 'aoe_type', ProjectileShape.AOE_TYPES.NONE);
    var AOESprite = idx(this.hitEffectDef, 'aoe_sprite', 'sprite_explosion');
    var aoeUnitsToHit = [];
    var damageDealt = 0;
    if (AOEType == ProjectileShape.AOE_TYPES.NONE) {
      damageDealt += this.doHitEffectOnUnit(boardState, unit, intersection, projectile);
    } else if (AOEType == ProjectileShape.AOE_TYPES.BOX) {
      var size = idx(this.hitEffectDef, 'aoe_size', {x: [-1, 1], y: [-1, 1]});
      for (var x = size.x[0]; x <= size.x[1]; x++) {
        for (var y = size.y[0]; y <= size.x[1]; y++) {
          var targetPos = {
            x: unit.x + x * Unit.UNIT_SIZE,
            y: unit.y + y * Unit.UNIT_SIZE
          }
          EffectFactory.createExplosionSpriteAtUnit(boardState, targetPos, AOESprite);
          var unitsAtPosition = boardState.sectors.getUnitsAtPosition(
            targetPos.x, targetPos.y
          );
          for (var targetUnit in unitsAtPosition) {
            aoeUnitsToHit.push(boardState.findUnit(unitsAtPosition[targetUnit]));
          }
        }
      }
    }
    if (aoeUnitsToHit) {
      aoeUnitsToHit.forEach(((targetUnit) => {
        EffectFactory.createDamageEntireUnitEffect(boardState, targetUnit);
        damageDealt += this.doHitEffectOnUnit(boardState, targetUnit, null, projectile);
      }).bind(this));
    }
    return damageDealt;
  }

  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    return 0;
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
