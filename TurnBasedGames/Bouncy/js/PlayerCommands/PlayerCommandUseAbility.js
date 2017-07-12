class PlayerCommandUseAbility extends PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    super(x, y, abilityID);
    this.ACTIVATE_ON_TICK = 1;
  }

  doActionOnTick(tick, boardState) {
    if (tick == this.ACTIVATE_ON_TICK || tick == 10 || tick == 20 || tick == 30 || tick == 40) {
      var castPoint = boardState.getPlayerCastPoint(this.playerID);

      var startX = castPoint.x;
      var startY = castPoint.y;
      for (var i = 0; i <= 0; i++) {
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
