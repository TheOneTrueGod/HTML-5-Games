const EMERGENCY_BREAK_TIME = 300;
class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.boardSize = {width: 522, height: 450};

    this.borderWalls = [
      Line(0, 0, 0, this.boardSize.height),
      Line(0, 0, this.boardSize.width, 0),
      Line(this.boardSize.width, this.boardSize.height, this.boardSize.width, 0),
    ];
    this.playerCastPoints = [];

    this.boardStateAtStartOfTurn = null;

    this.sectors = new UnitSectors(24, 12, this.boardSize.width, this.boardSize.height);

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

  endPhase() {
    this.tick = 0;

    var i = 0;
    while (i < this.projectiles.length) {
      if (true) {
        this.projectiles[i].removeFromStage(this.stage);
        this.projectiles.splice(i, 1);
      } else {
        i ++;
      }
    }
  }

  incrementTurn() {
    this.turn += 1;

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
    this.sectors.addUnit(unit);
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

  atEndOfPhase(playerCommands, phase) {
    if (this.tick > EMERGENCY_BREAK_TIME) {
      return true;
    }

    if (this.projectiles.length > 0) {
      return false;
    }

    for (var i = 0; i < this.units.length; i++) {
      if (!this.units[i].isFinishedDoingAction()) {
        return false;
      }
    }

    if (TurnPhasesEnum.isPlayerCommandPhase(phase)) {
      var commands = this.getPlayerActionsInPhase(playerCommands, phase);

      if (commands) {
        for (var i = 0; i < commands.length; i++) {
          if (!commands[i].hasFinishedDoingEffect(this.tick)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  runTick(playerCommands, phase) {
    for (var unit in this.units) {
      this.units[unit].runTick(this);
    }

    for (var projectile in this.projectiles) {
      this.projectiles[projectile].runTick(
        this, this.boardSize.width, this.boardSize.height
      );
    }
    var i = 0;
    while (i < this.projectiles.length) {
      if (this.projectiles[i].readyToDelete()) {
        this.projectiles[i].removeFromStage(this.stage);
        this.projectiles.splice(i, 1);
      } else {
        i ++;
      }
    }

    this.doPlayerActions(playerCommands, phase);

    this.tick += 1;

    MainGame.forceRedraw();
  }

  getPlayerActionsInPhase(playerCommands, phase) {
    var turnOrder = [0, 1, 2, 3];
    var commands = null;
    switch (phase) {
      case TurnPhasesEnum.PLAYER_ACTION_1:
        commands = playerCommands[turnOrder[0]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_2:
        commands = playerCommands[turnOrder[1]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_3:
        commands = playerCommands[turnOrder[2]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_4:
        commands = playerCommands[turnOrder[3]];
        break;
    }

    return commands;
  }

  doPlayerActions(playerCommands, phase) {
    var commands = this.getPlayerActionsInPhase(playerCommands, phase);

    if (commands) {
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        command.doActionOnTick(this.tick, this);
      }
    }
  }

  addProjectile(projectile) {
    projectile.addToStage(this.stage);
    this.projectiles.push(projectile);
  }

  getGameWalls() {
    return this.borderWalls;
  }
}
