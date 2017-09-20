class Turret extends ZoneEffect {
  constructor(x, y, owner, id, creatorAbilityID) {
    super(x, y, owner, id, creatorAbilityID);
    this.shootAngle = -Math.PI / 2;
    this.abilitiesLastUse = {};
  }

  createSprite() {
    var sprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables', 2));

    this.turretSprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables',
        this.creatorAbility.getOptionalParam("turret_image", 3)
      ));

    sprite.addChild(this.turretSprite);
    this.turretSprite.anchor.set(0.5);
    sprite.anchor.set(0.5);
    this.createHealthBarSprite(sprite);

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

        var angle = this.shootAngle;
        var angX = Math.cos(this.shootAngle) * 22;
        var angY = Math.sin(this.shootAngle) * 22;
        var castPoint = new Victor(
          this.x + angX,
          this.y + angY
        );
        var targetPoint = castPoint.clone().addScalarX(angX).addScalarY(angY);
        abilList[i].initializedAbilDef.doActionOnTick(0, boardState, castPoint, targetPoint);
        this.abilitiesLastUse[abil.index] = boardState.turn;
      }
    }
  }

  getSize() {
    return this.size;
  }

  triggerHit(boardState, unit, intersection, projectile) {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction.destroy) {
      this.decreaseTime(boardState, this.timeLeft.current);
      this.createHealthBarSprite(this.gameSprite);
      projectile.readyToDel = true;
    }
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = {
      left: 0, right: 0,
      top: 0, bottom: 0
    };
  }

  serializeData() {
    return {
      'duration': this.timeLeft,
      'creator_id': this.creatorAbility.index,
      'abilities_used': this.abilitiesLastUse,
    };
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
