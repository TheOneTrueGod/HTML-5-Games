class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    if (!defJSON['shape'] || !defJSON['contact_effect']) {
      throw new Error("shape and contact_effect are required in a ProjectileAbilityDef");
    }

    this.shapeType = defJSON['shape'];
    this.contactEffect = defJSON['contact_effect'];
    this.hitEffect = defJSON['hit_effect'] ?
      defJSON['hit_effect'] :
      ProjectileAbilityDef.HitEffects.DAMAGE;
    this.base_damage = defJSON['base_damage'];
    this.rawDef = defJSON;

    this.shape = ProjectileShape.getProjectileShape(defJSON['shape'], this);
  }

  getContactEffect() {
    return this.contactEffect;
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.rawDef) {
      return this.rawDef[param];
    }
    return defaultValue;
  }

  getBaseDamage() {
    return this.base_damage;
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    this.shape.doActionOnTick(tick, boardState, castPoint, targetPoint);
  }

  hasFinishedDoingEffect(tickOn) {
    return this.shape.hasFinishedDoingEffect(tickOn);
  }

  getAbilityHTML() {
    var cardClass = "tempFirstAbil";
    switch (this.contactEffect) {
      case ProjectileAbilityDef.ContactEffects.HIT:
        cardClass = "tempSecondAbil";
        break;
      case ProjectileAbilityDef.ContactEffects.BOUNCE:
        cardClass = "tempFirstAbil";
        break;
    }

    var $card = $("<div>", {
      "class": "abilityCard " + cardClass + "",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);

    this.shape.appendIconHTML($icon);

    var $iconDesc = $("<div>", {"class": "abilityCardIconDesc"});
    this.shape.appendIconDescHTML($iconDesc);
    if ($iconDesc.children().length > 1) {
      $card.append($iconDesc);
    }

    var $textDesc = $("<div>", {"class": "abilityCardTextDesc"});
    $card.append($textDesc);
    this.shape.appendTextDescHTML($textDesc);

    return $card;
  }
}

ProjectileAbilityDef.Shapes = {
  SINGLE_SHOT: 'SINGLE_SHOT',
  TRI_SHOT: 'TRI_SHOT',
  CHAIN_SHOT: 'CHAIN_SHOT',
};

ProjectileAbilityDef.ContactEffects = {
  HIT: 'HIT',
  BOUNCE: 'BOUNCE',
};

ProjectileAbilityDef.HitEffects = {
  DAMAGE: 'DAMAGE',
};
