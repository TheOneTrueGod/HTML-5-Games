class Turret extends Unit {
  constructor(x, y, owner, id, duration, creatorAbilityID) {
    super(x, y, owner, id);

    this.timeLeft = duration;

    this.abilitiesLastUse = {};
    if (creatorAbilityID) {
      this.setCreatorAbility(creatorAbilityID);
    }
  }

  createSprite() {
    var sprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables', 2));

    this.turretSprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables', 3));

    sprite.addChild(this.turretSprite);
    this.turretSprite.anchor.set(0.5);
    sprite.anchor.set(0.5);
    return sprite;
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase === TurnPhasesEnum.ALLY_ACTION) {
      var abilList = this.creatorAbility.getOptionalParam('unit_abilities', {});
      for (var i = 0; i < abilList.length; i++) {
        let abil = abilList[i].initializedAbilDef;
        if (
          abil.index in this.abilitiesLastUse &&
          abil.chargeType == AbilityDef.CHARGE_TYPES.TURNS &&
          boardState.turn - this.abilitiesLastUse[abil.index] < abil.maxCharge
        ) {
          continue;
        }

        var castPoint = new Victor(this.x, this.y);
        var targetPoint = castPoint.clone();
        targetPoint.y -= Unit.UNIT_SIZE;
        abilList[i].initializedAbilDef.doActionOnTick(0, boardState, castPoint, targetPoint);
        this.abilitiesLastUse[abil.index] = boardState.turn;
      }
    } else if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.readyToDel = true;
      }
    }
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
  }

  serializeData() {
    return {
      'duration': this.timeLeft,
      'creator_id': this.creatorAbility.index,
      'abilities_used': this.abilitiesLastUse,
    };
  }

  preventsUnitEntry(unit) {
    return false;
  }

  otherUnitEntering(boardState, unit) {
    this.readyToDel = true;
    EffectFactory.createUnitDyingEffect(boardState, this);
    return true;
  }

  loadSerializedData(data) {
    this.timeLeft = data.duration;
    this.setCreatorAbility(data.creator_id);
    this.abilitiesLastUse = data.abilities_used;
  }
}

Turret.AddToTypeMap();
