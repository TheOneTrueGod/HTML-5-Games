class BoardState {
  constructor(stage, serverData) {
    this.stage = stage;

    this.units = [];
    this.turn = 1;
    this.tick = 0;

    if (serverData) {
      boardState = JSON.parse(serverData);
      if (serverData.units) {
        this.units = serverData.units.map(
          function(unitData) {
            return unit.loadFromServerData(unitData);
          }
        );
      }

      if (serverData.turn) { this.turn = serverData.turn; }
      if (serverData.tick) { this.tick = serverData.tick; }
    }
  }

  incrementTurn() {
    this.turn += 1;
  }

  serializeBoardState() {
    return JSON.stringify({
      'units': this.units.map(function (unit) { return unit.serialize() }),
      'turn': this.turn,
      'tick': this.tick,
    });
  }

  addUnit(unit) {
    unit.addToStage(this.stage);
    this.units.push(unit);
  }

  runTick(playerCommands) {
    this.tick += 1;

    for (var unit in this.units) {
      this.units[unit].runTick();
    }

    for (var id in playerCommands) {
      var commands = playerCommands[id];
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        command.doActionOnTick(this.tick, this);
      }
    }

    //Tell the `renderer` to `render` the `stage`
    MainGame.renderer.render(MainGame.stage);
  }
}
