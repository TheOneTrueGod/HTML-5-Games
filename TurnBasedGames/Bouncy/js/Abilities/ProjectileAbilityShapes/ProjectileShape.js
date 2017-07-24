class ProjectileShape {
  constructor(abilityDef) {
    this.shapeType = abilityDef.shapeType;
    this.contactEffect = abilityDef.getContactEffect();
    this.abilityDef = abilityDef;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var damageDealt = 0;

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
          var base_damage = 0;
          if (this.abilityDef.getContactEffect() == ProjectileShape.ContactEffects.PENETRATE) {
            base_damage = projectile.maxDamage;
          } else {
            base_damage = this.abilityDef.getBaseDamage();
          }
          var finalDamage = base_damage;
          damageDealt += unit.dealDamage(boardState, finalDamage);
          break;
      }
    }
    return damageDealt;
  }

  appendTextDescHTML($container) {
    var $textContainer =
      $("<div>", {
        "class": "textDescText",
      });
    $textContainer.text(this.getTextDesc());
    $container.append($textContainer);
  }

  getIconDescHTML($container) {
    var hitEffects = this.abilityDef.getHitEffects();
    if (hitEffects.indexOf(ProjectileShape.HitEffects.POISON) !== -1) {
      var $textContainer =
        $("<div>", {
          "class": "textDescText"
        });
      $textContainer.text("Poison");
      return $textContainer;
    }
    return null;
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
  PENETRATE: 'PENETRATE', // Carries on through until all of its damage is spent
  PASSTHROUGH: 'PASSTHROUGH', // Pierces through units and deals its damage to some total number of them
};

ProjectileShape.HitEffects = {
  DAMAGE: 'DAMAGE',
  POISON: 'POISON'
};
