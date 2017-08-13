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

    var chargeData = idx(defJSON, 'charge', {});
    this.chargeType = idx(defJSON['charge'], 'charge_type', AbilityDef.CHARGE_TYPES.TURNS);
    this.maxCharge = idx(defJSON['charge'], 'max_charge', 0);
    this.charge = idx(defJSON['charge'], 'initial_charge', 0);
    if (this.charge == -1) {
      this.charge = this.maxCharge;
    }
  }

  loadNestedAbilityDefs(nestedList) {
    for (var i = 0; i < nestedList.length; i++) {
      if (
        nestedList[i].effect && (
          nestedList[i].effect == ZoneAbilityDef.UnitEffectTypes.ABILITY ||
          nestedList[i].effect == PositionBasedEffect.EFFECTS.USE_ABILITY
      )) {
        nestedList[i].initializedAbilDef =
          AbilityDef.createFromJSON(nestedList[i].abil_def);
      }
    }
  }

  endOfTurn() {
    if (this.chargeType == AbilityDef.CHARGE_TYPES.TURNS) {
      this.charge = Math.min(this.maxCharge, this.charge + 1);
      this.chargeUpdated();
    }
  }

  chargeUpdated() {
    if (this.canBeUsed()) {
      $('[ability-id=' + this.index + ']')
        .removeClass("disabled");
    } else {
      $('[ability-id=' + this.index + ']')
        .addClass("disabled")
        .find('.chargeNumber')
        .text(this.maxCharge - this.charge);
    }
  }

  canBeUsed() {
    return this.charge >= this.maxCharge;
  }

  serializeData() {
    return {'charge': this.charge};
  }

  deserializeData(dataJSON) {
    this.charge = dataJSON.charge ? dataJSON.charge : 0;
    this.chargeUpdated();
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    throw new Error("Ability Defs shouldn't be initialized");
  }

  hasFinishedDoingEffect(tickOn) {
    throw new Error("Ability Defs shouldn't be initialized");
  }

  getAbilityHTML() {
    var card = this.createAbilityCard();
    var chargeDisplay = $("<div>", {"class": "chargeDisplay"});
    switch(this.chargeType) {
      case AbilityDef.CHARGE_TYPES.TURNS:
        chargeDisplay.addClass("chargeTypeTurns");
      break;
    }
    card.append(chargeDisplay);

    var chargeNumber = $("<div>", {"class": "chargeNumber"});
    chargeDisplay.append(chargeNumber);

    return card;
  }

  createAbilityCard() {
    throw new Error("Ability Defs shouldn't be initialized");
  }

  createTargettingGraphic(startPos, endPos, color) {
    return null;
  }

  getValidTarget(target) {
    return {x: target.x, y: target.y};
  }
}
AbilityDef.CHARGE_TYPES = {
  TURNS: 'TURNS'
};

AbilityDef.abilityDefList = {};
AbilityDef.ABILITY_DEF_INDEX = 0;

AbilityDef.AbilityTypes = {
  PROJECTILE: 'PROJECTILE',
  ZONE: 'ZONE',
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
    case AbilityDef.AbilityTypes.ZONE:
      return new ZoneAbilityDef(defJSON);
    default:
      throw new Error("[" + defJSON['abilityType'] + "] not handled");
  }
  abilityType = defJSON['ability_type'];
}

/* Abilities for;
 * Chip
  * Request -- Support-based role
  * 1 - Some kind of damage ability
  * [Done] 2 - Single shot Penetrate ability.  Lots of damage that penetrates
  * 3 - Counter-based ability. Block a single enemy from damaging the team.
    * If this succeeds, shoot a projectile in each column around him.
  * 4 - Freeze single target for 3 turns.
  * 5 - % health reduction to an area
  *
  * OTHER - reduce all enemies in an area's health by 50%
 * Mitch
  * Probably tricky and unique things
  * Deal minor damage to an enemy.  If it dies, release a bunch of bullets.
 * Jeremy
 * Tabitha
*/
