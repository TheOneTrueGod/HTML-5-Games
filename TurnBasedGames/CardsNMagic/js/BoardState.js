class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.units = [];
    this.turn = 1;
    this.tick = 0;
    this.UNIT_ID_INDEX = 1;
    if (boardState) {
      if (boardState.turn) { this.turn = boardState.turn; }
      if (boardState.tick) { this.tick = boardState.tick; }
      if (boardState.unit_id_index) { this.UNIT_ID_INDEX = boardState.unit_id_index; }
    }

    MainGame.forceRedraw();
  }

  loadUnits(serverData) {
    for (var i = 0; i < serverData.length; i++) {
      var unitData = serverData[i];
      var newUnit = Unit.loadFromServerData(unitData);
      this.addUnit(newUnit);
    }
  }

  addInitialPlayers() {
    for (var i = 0; i < 4; i++) {
      var newCore = new UnitCore(50 + i * 100, 300);
      this.addUnit(newCore);
    }
  }

  incrementTurn() {
    this.turn += 1;
  }

  serializeBoardState() {
    return {
      'units': this.units.map(function (unit) { return unit.serialize() }),
      'turn': this.turn,
      'tick': this.tick,
      'unit_id_index': this.UNIT_ID_INDEX,
    };
  }

  getUnitID() {
    this.UNIT_ID_INDEX += 1;
    return this.UNIT_ID_INDEX - 1;
  }

  addUnit(unit) {
    unit.addToStage(this.stage);
    this.units.push(unit);
  }

  findUnit(unitID) {
    for (var i = 0; i < this.units.length; i++) {
      if (this.units[i].id == unitID) {
        return this.units[i];
      }
    }
    return null;
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

    MainGame.forceRedraw();
  }
}
