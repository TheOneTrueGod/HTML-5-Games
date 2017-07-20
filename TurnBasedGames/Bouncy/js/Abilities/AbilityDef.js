class AbilityDef {
  constructor(defJSON) {
    this.index = AbilityDef.ABILITY_DEF_INDEX;
    AbilityDef.abilityDefList[this.index] = this;
    AbilityDef.ABILITY_DEF_INDEX += 1;

    if (!defJSON['ability_type']) {
      throw new Error("Ability Defs need an abilityType");
    }
    this.abilityType = defJSON['ability_type'];
    this.ACTIVATE_ON_TICK = 1;
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var i = -1; i <= 1; i++) {
        var angle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        ) + Math.PI / 64.0 * i;
        boardState.addProjectile(
          new Projectile(castPoint.x, castPoint.y, angle)
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }

  getAbilityHTML() {
    return $("<div>", {
      "class": "abilityCard tempFirstAbil",
      "ability-id": this.index,
    });
  }
}

AbilityDef.abilityDefList = {};
AbilityDef.ABILITY_DEF_INDEX = 0;

AbilityDef.AbilityTypes = {
  PROJECTILE: 'PROJECTILE',
  LASER: 'LASER',
  SPECIAL: 'SPECIAL'
};

AbilityDef.createFromJSON = function(defJSON) {
  if (!defJSON['ability_type']) {
    throw new Error("defJSON needs an ability_type")
  }
  switch (defJSON['ability_type']) {
    case AbilityDef.AbilityTypes.PROJECTILE:
      return new ProjectileAbilityDef(defJSON);
    default:
      throw new Error("[" + defJSON['abilityType'] + "] not handled");
  }
  abilityType = defJSON['ability_type'];
}

class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    if (!defJSON['shape'] || !defJSON['contact_effect']) {
      throw new Error("shape and contact_effect are required in a ProjectileAbilityDef");
    }
    this.shape = defJSON['shape'];
    this.contactEffect = defJSON['contact_effect'];
    this.hitEffect = defJSON['hit_effect'] ?
      defJSON['hit_effect'] :
      ProjectileAbilityDef.HitEffects.DAMAGE
  }
}

ProjectileAbilityDef.Shapes = {
  SINGLE_SHOT: 'SINGLE_SHOT',
  TRI_SHOT: 'TRI_SHOT',
};

ProjectileAbilityDef.ContactEffects = {
  HIT: 'HIT',
  BOUNCE: 'BOUNCE',
};

ProjectileAbilityDef.HitEffects = {
  DAMAGE: 'DAMAGE',
};
