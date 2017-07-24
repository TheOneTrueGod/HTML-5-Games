class ProjectileShape {
  constructor(abilityDef) {
    this.shapeType = abilityDef.shapeType;
    this.contactEffect = abilityDef.getContactEffect();
    this.abilityDef = abilityDef;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      switch (hitEffects[i]) {
        case ProjectileShape.HitEffects.POISON:
          var poisonData = this.abilityDef.getOptionalParam('poison', {});
          unit.addStatusEffect(
            new PoisonStatusEffect(
              idx(poisonData, 'duration', 1),
              idx(poisonData, 'damage', 0),
              idx(poisonData, 'effect', 2)
            )
          );
          break;
        case ProjectileShape.HitEffects.DAMAGE:
          var base_damage = this.abilityDef.getBaseDamage();
          var finalDamage = base_damage;
          unit.dealDamage(boardState, finalDamage);
          break;
      }

    }
  }

  appendTextDescHTML($container) {
    var $textContainer =
      $("<div>", {
        "class": "textDescText",
      });
    $textContainer.text(this.getTextDesc());
    $container.append($textContainer);
  }
}

ProjectileShape.getProjectileShape = function(shapeType, abilityDef) {
  switch (shapeType) {
    case ProjectileAbilityDef.Shapes.SINGLE_SHOT:
      return new ProjectileShapeSingleShot(abilityDef);
      break;
    case ProjectileAbilityDef.Shapes.TRI_SHOT:
      return new ProjectileShapeTriShot(abilityDef);
      break;
    case ProjectileAbilityDef.Shapes.CHAIN_SHOT:
      return new ProjectileShapeChainShot(abilityDef);
      break;
  }
  throw new Error("Undefined shape type: [" + shapeType + "]");
}


ProjectileShape.ContactEffects = {
  HIT: 'HIT',
  BOUNCE: 'BOUNCE',
  AOE_EFFECT: 'AOE_EFFECT',
};

ProjectileShape.HitEffects = {
  DAMAGE: 'DAMAGE',
};
