class ProjectileShape {
  constructor(abilityDef) {
    this.shapeType = abilityDef.shapeType;
    this.contactEffect = abilityDef.getContactEffect();
    this.abilityDef = abilityDef;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var damageDealt = 0;
    if (projectile.hitEffects) {
      hitEffects = projectile.hitEffects;
    } else {
      var hitEffects = this.abilityDef.getHitEffects();
    }

    var damageDealt = 0;
    for (var i = 0; i < hitEffects.length; i++) {
      var hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this.abilityDef, this);
      damageDealt += hitEffect.doHitEffect(boardState, unit, intersection, projectile);
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
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.POISON) {
        var $textContainer =
          $("<div>", {
            "class": "textDescText"
          });
        $textContainer.text("Poison");
        return $textContainer;
      }
      if (hitEffects[i].effect == ProjectileShape.HitEffects.FREEZE) {
        var $textContainer =
          $("<div>", {
            "class": "textDescText"
          });
        $textContainer.text("Freeze");
        return $textContainer;
      }
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
    case ProjectileAbilityDef.Shapes.SPRAY_SHOT:
      return new ProjectileShapeSprayShot(abilityDef);
      break;
    case ProjectileAbilityDef.Shapes.RAIN:
      return new ProjectileShapeRainShot(abilityDef);
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
  POISON: 'POISON',
  FREEZE: 'FREEZE',
  BULLET_SPLIT: 'BULLET_SPLIT',
};

ProjectileShape.AOE_TYPES = {
  NONE: 'NONE',
  BOX: 'BOX'
};
