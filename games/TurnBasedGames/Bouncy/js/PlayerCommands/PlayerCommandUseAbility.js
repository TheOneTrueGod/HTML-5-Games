class PlayerCommandUseAbility extends PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    super(x, y, abilityID);
    this.abilityDef = AbilityDef.abilityDefList[abilityID];
  }

  doActionOnTick(tick, boardState) {
    var castPoint = boardState.getPlayerCastPoint(this.playerID);
    this.abilityDef.doActionOnTick(
      tick, boardState, castPoint, {x: this.x, y: this.y}
    );
  }

  hasFinishedDoingEffect(tickOn) {
    return this.abilityDef.hasFinishedDoingEffect(tickOn);
  }
}

PlayerCommandUseAbility.AddToTypeMap();