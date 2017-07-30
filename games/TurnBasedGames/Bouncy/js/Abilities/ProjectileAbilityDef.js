class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    if (!defJSON['shape'] || !defJSON['contact_effect']) {
      throw new Error("shape and contact_effect are required in a ProjectileAbilityDef");
    }

    this.shapeType = defJSON['shape'];
    this.contactEffect = defJSON['contact_effect'];
    this.hitEffects = defJSON['hit_effects'] ?
      defJSON['hit_effects'] :
      [ProjectileShape.HitEffects.DAMAGE];
    this.base_damage = defJSON['base_damage'];
    this.rawDef = defJSON;

    this.shape = ProjectileShape.getProjectileShape(defJSON['shape'], this);
  }

  getHitEffects() {
    return this.hitEffects;
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
      case ProjectileShape.ContactEffects.HIT:
        cardClass = "cardContactHit";
        break;
      case ProjectileShape.ContactEffects.BOUNCE:
        cardClass = "cardContactBounce";
        break;
      case ProjectileShape.ContactEffects.AOE_EFFECT:
        cardClass = "cardContactAOE";
        break;
      case ProjectileShape.ContactEffects.PENETRATE:
        cardClass = "cardContactPen";
        break;
      case ProjectileShape.ContactEffects.PASSTHROUGH:
        cardClass = "cardContactPierce";
        break;
    }

    var $card = $("<div>", {
      "class": "abilityCard " + cardClass + "",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);

    this.shape.appendIconHTML($icon);

    var $iconDesc = this.shape.getIconDescHTML($iconDesc);
    if ($iconDesc) {
      var $iconDesc = $("<div>", {"class": "abilityCardIconDesc"}).append($iconDesc);
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
