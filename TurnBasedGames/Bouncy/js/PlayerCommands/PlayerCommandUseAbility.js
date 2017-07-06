class PlayerCommandUseAbility extends PlayerCommand {
  doActionOnTick(tick, boardState) {
    const TICK_TO_ACTIVATE = 3;
    if (tick == TICK_TO_ACTIVATE) {
      console.log("Go Go Go");
    }
  }
}

PlayerCommandUseAbility.AddToTypeMap();
