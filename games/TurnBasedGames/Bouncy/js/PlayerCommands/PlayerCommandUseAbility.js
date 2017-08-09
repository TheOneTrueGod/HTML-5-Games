class PlayerCommandUseAbility extends PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    var abil = AbilityDef.abilityDefList[abilityID];
    var target = abil.getValidTarget({x: x, y: y});
    super(target.x, target.y, abilityID);
    this.abilityDef = AbilityDef.abilityDefList[abilityID];
  }

  doActionOnTick(tick, boardState) {
    var castPoint = boardState.getPlayerCastPoint(this.playerID);
    this.abilityDef.doActionOnTick(
      tick, boardState, castPoint, {x: this.x, y: this.y}
    );
    this.abilityDef.charge = 0;
  }

  hasFinishedDoingEffect(tickOn) {
    return this.abilityDef.hasFinishedDoingEffect(tickOn);
  }
}

PlayerCommandUseAbility.AddToTypeMap();
