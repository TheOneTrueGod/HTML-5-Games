class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.boardSize = {width: 522, height: 450};
    this.playerCastPoints = [];

    this.boardStateAtStartOfTurn = null;

    this.reset();
    this.deserialize(boardState);

    this.projectiles = [];

    MainGame.forceRedraw();
  }

  reset() {
    this.units = [];
    this.turn = 1;
    this.tick = 0;
    this.UNIT_ID_INDEX = 1;
  }

  deserialize(boardState) {
    if (!boardState) { return; }
    if (boardState.turn) { this.turn = boardState.turn; }
    if (boardState.tick) { this.tick = boardState.tick; }
    if (boardState.unit_id_index) { this.UNIT_ID_INDEX = boardState.unit_id_index; }
  }

  saveState() {
    this.boardStateAtStartOfTurn = this.serializeBoardState();
  }

  loadState() {
    this.reset();
    while(this.stage.children.length > 0){
      this.stage.removeChild(
        this.stage.getChildAt(0)
      );
    }

    this.deserialize(this.boardStateAtStartOfTurn);
    if (this.boardStateAtStartOfTurn.units) {
      this.loadUnits(this.boardStateAtStartOfTurn.units);
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

  addInitialPlayers(numPlayers) {
    var playerGap = this.boardSize.width / numPlayers;
    for (var i = 0; i < numPlayers; i++) {
      var newCore = new UnitCore(playerGap / 2 + i * playerGap, this.boardSize.height - 20, i);
      this.addUnit(newCore);
    }
  }

  incrementTurn() {
    this.turn += 1;
    this.tick = 0;
    $('#turn').text('Turn ' + this.turn);
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
    if (unit instanceof UnitCore) {
      this.playerCastPoints[unit.owner] = unit;
    }
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

  getPlayerCastPoint(playerID) {
    if (playerID in this.playerCastPoints) {
      return {
        x: this.playerCastPoints[playerID].x,
        y: this.playerCastPoints[playerID].y
      };
    }

    throw new Exception(
      "Trying to get a player Cast Point for a player that doesn't exist. " +
      "Player ID: [" + playerID + "] " +
      "Cast Points: [" + this.playerCastPoints + "]"
    );
  }

  atEndOfTurn(playerCommands) {
    if (this.tick > 50) {
      return true;
    }
    
    if (this.projectiles.length > 0) {
      return false;
    }

    for (var player = 0; player < playerCommands.length; player++) {
      if (playerCommands[player]) {
        for (var i = 0; i < playerCommands[player].length; i++) {
          if (!playerCommands[player][i].hasFinishedDoingEffect(this.tick)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  runTick(playerCommands) {

    for (var unit in this.units) {
      this.units[unit].runTick();
    }

    for (var projectile in this.projectiles) {
      this.projectiles[projectile].runTick();
    }

    for (var id in playerCommands) {
      var commands = playerCommands[id];
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        command.doActionOnTick(this.tick, this);
      }
    }

    this.tick += 1;

    MainGame.forceRedraw();
  }

  addProjectile(projectile) {
    projectile.addToStage(this.stage);
    this.projectiles.push(projectile);
  }
}
