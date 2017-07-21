class ProjectileShape {
  constructor(abilityDef) {
    this.shapeType = abilityDef.shapeType;
    this.contactEffect = abilityDef.getContactEffect();
    this.abilityDef = abilityDef;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var base_damage = this.abilityDef.getBaseDamage();

    var finalDamage = base_damage;
    unit.dealDamage(boardState, finalDamage);
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
