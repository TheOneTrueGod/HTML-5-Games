class PlayerCommandUseAbility extends PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    super(x, y, abilityID);
    this.ACTIVATE_ON_TICK = 1;
  }

  doActionOnTick(tick, boardState) {
    if (tick == this.ACTIVATE_ON_TICK) {
      var castPoint = boardState.getPlayerCastPoint(this.playerID);

      var startX = castPoint.x;
      var startY = castPoint.y;
      for (var i = -1; i <= 1; i++) {
        var angle = Math.atan2(this.y - startY, this.x - startX) + Math.PI / 24.0 * i;
        boardState.addProjectile(
          new Projectile(startX, startY, angle)
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}

PlayerCommandUseAbility.AddToTypeMap();
