const EMERGENCY_BREAK_TIME = 200;
const EFFECT_TICK_DELAY = 20;

class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.borderWalls = [
      new BorderWallLine(0, 0, 0, this.boardSize.height),
      new BorderWallLine(0, 0, this.boardSize.width, 0),
      new BorderWallLine(this.boardSize.width, this.boardSize.height, this.boardSize.width, 0),
    ];
    this.playerCastPoints = [];
    this.effects = [];

    this.boardStateAtStartOfTurn = null;

    this.sectors = new UnitSectors(9, 12, this.boardSize.width, this.boardSize.height);

    this.reset();
    this.deserialize(boardState);

    this.projectiles = [];

    UIListeners.updateTeamHealth(this.teamHealth[0] / this.teamHealth[1]);
    this.noActionKillLimit = 0;

    this.runEffectTicks();
  }

  getRandom() {
    var max_value = 6781335567;
    var large_prime = 18485345523457;
    var toRet = (this.randomSeed + large_prime) % max_value;
    this.randomSeed += toRet;
    return toRet / max_value;
  }

  reset() {
    this.units = [];
    this.sectors.reset();
    this.turn = 1;
    this.tick = 0;
    this.UNIT_ID_INDEX = 1;
    this.teamHealth = [40, 40];
    this.wavesSpawned = 0;
    this.enemyUnitCount = 0;
    this.resetRandomSeed();
    this.resetNoActionKillSwitch();
  }

  resetRandomSeed() {
    this.randomSeed = Math.floor(Math.random() * 4432561237);
  }

  deserialize(boardState) {
    if (!boardState) { return; }
    if (boardState.turn) { this.turn = boardState.turn; }
    if (boardState.tick) { this.tick = boardState.tick; }
    if (boardState.unit_id_index) { this.UNIT_ID_INDEX = boardState.unit_id_index; }
    if (boardState.team_health) { this.teamHealth = boardState.team_health; }
    if (boardState.waves_spawned) { this.wavesSpawned = boardState.waves_spawned; }
    if (boardState.random_seed) {
      this.randomSeed = boardState.random_seed;
    } else {
      this.resetRandomSeed();
    }
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
  }

  loadUnits(serverData) {
    for (var i = 0; i < serverData.length; i++) {
      var unitData = serverData[i];
      var newUnit = Unit.loadFromServerData(unitData);
      this.addUnit(newUnit);
    }
  }

  addInitialPlayers(players) {
    var numPlayers = 0;
    for (var key in players) { numPlayers += 1; }
    var playerGap = this.boardSize.width / numPlayers;
    var playerOn = 0;
    for (var key in players) {
      var player = players[key];
      var newCore = new UnitCore(
        playerGap / 2 + playerOn * playerGap,
        this.boardSize.height - 20,
        player.getUserID()
      );
      this.addUnit(newCore);
      playerOn += 1;
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
  }

  resetNoActionKillSwitch() {
    this.noActionKillLimit = 0;
  }

  serializeBoardState() {
    return {
      'units': this.units.map(function (unit) { return unit.serialize() }),
      'turn': this.turn,
      'tick': this.tick,
      'random_seed': this.randomSeed,
      'unit_id_index': this.UNIT_ID_INDEX,
      'team_health': this.teamHealth,
      'waves_spawned': this.wavesSpawned,
    };
  }

  getUnitID() {
    this.UNIT_ID_INDEX += 1;
    return this.UNIT_ID_INDEX - 1;
  }

  addUnit(unit) {
    if (unit instanceof UnitCore) {
      this.playerCastPoints[unit.owner] = unit;
    } else {
      this.sectors.addUnit(unit);
      this.enemyUnitCount += 1;
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

  unitEntering(unit, target) {
    var unitsInSector = this.sectors.getUnitsAtPosition(target.x, target.y);
    var allowUnitThrough = true;
    for (var i = 0; i < unitsInSector.length; i++) {
      var occupyingUnit = this.findUnit(unitsInSector[i]);
      allowUnitThrough = allowUnitThrough && occupyingUnit.otherUnitEntering(this, unit);
    }
    return allowUnitThrough;
  }

  getPlayerCastPoint(playerID) {
    if (playerID in this.playerCastPoints) {
      return {
        x: this.playerCastPoints[playerID].x,
        y: this.playerCastPoints[playerID].y
      };
    }

    throw new Error(
      "Trying to get a player Cast Point for a player that doesn't exist. " +
      "Player ID: [" + playerID + "] " +
      "Cast Points: [" + this.playerCastPoints + "]"
    );
  }

  atEndOfPhase(players, playerCommands, phase) {
    if (this.noActionKillLimit > EMERGENCY_BREAK_TIME) {
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
      var commands = this.getPlayerActionsInPhase(players, playerCommands, phase);

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

  startOfPhase(phase) {
    this.resetNoActionKillSwitch();
    for (var unit in this.units) {
      this.units[unit].startOfPhase(this, phase);
    }
    this.doDeleteChecks();
  }

  endOfPhase(phase) {
    this.resetNoActionKillSwitch();
    for (var unit in this.units) {
      this.units[unit].endOfPhase(this, phase);
    }
    this.doDeleteChecks();
  }

  doDeleteChecks() {
    var i = 0;
    while (i < this.units.length) {
      if (this.units[i].readyToDelete()) {
        this.units[i].removeFromStage();
        this.sectors.removeUnit(this.units[i]);
        if (!(this.units[i] instanceof UnitCore)) {
          this.enemyUnitCount -= 1;
        }
        this.units.splice(i, 1);
      } else {
        i ++;
      }
    }
  }

  doUnitActions() {
    for (var unit in this.units) {
      this.units[unit].doUnitActions(this);
    }

    this.doDeleteChecks();
  }

  runTick(players, playerCommands, phase) {
    this.runUnitTicks();

    this.runProjectileTicks();

    this.doPlayerActions(players, playerCommands, phase);

    this.tick += 1;
    this.noActionKillLimit += 1;
  }

  runUnitTicks() {
    for (var unit in this.units) {
      this.units[unit].runTick(this);
    }

    this.doDeleteChecks();
  }

  runProjectileTicks() {
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
  }

  runEffectTicks() {
    for (var effect in this.effects) {
      this.effects[effect].runTick(
        this, this.boardSize.width, this.boardSize.height
      );
    }

    var i = 0;
    while (i < this.effects.length) {
      if (this.effects[i].readyToDelete()) {
        this.effects[i].removeFromStage(this.stage);
        this.effects.splice(i, 1);
      } else {
        i ++;
      }
    }
    window.setTimeout(this.runEffectTicks.bind(this), EFFECT_TICK_DELAY);
  }

  getPlayerActionsInPhase(players, playerCommands, phase) {
    var turnOrder = [0, 1, 2, 3];
    var currPlayer = null;
    switch (phase) {
      case TurnPhasesEnum.PLAYER_ACTION_1:
        currPlayer = players[turnOrder[0]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_2:
        currPlayer = players[turnOrder[1]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_3:
      currPlayer = players[turnOrder[2]];
        break;
      case TurnPhasesEnum.PLAYER_ACTION_4:
        currPlayer = players[turnOrder[3]];
        break;
    }
    if (!currPlayer) {
      return null;
    }
    var commands = playerCommands[currPlayer.getUserID()];

    return commands;
  }

  doPlayerActions(players, playerCommands, phase) {
    var commands = this.getPlayerActionsInPhase(players, playerCommands, phase);

    if (commands) {
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        command.doActionOnTick(this.tick, this);
      }
    }
  }

  addProjectile(projectile) {
    projectile.addToStage(this.stage);
    if (projectile instanceof Effect && false) {
      this.effects.push(projectile);
    } else {
      this.projectiles.push(projectile);
    }
  }

  getGameWalls() {
    return this.borderWalls.slice(0);
  }

  getUnitThreshold() {
    return this.boardSize.height - Unit.UNIT_SIZE * 1.4;
  }

  dealDamage(amount) {
    this.teamHealth[0] = Math.max(this.teamHealth[0] - amount, 0);
    UIListeners.updateTeamHealth(this.teamHealth[0] / this.teamHealth[1]);
  }

  isGameOver(aiDirector) {
    if (this.teamHealth[0] <= 0) { // Players Lost
      return true;
    }
    if (
      this.enemyUnitCount <= 0 &&
      this.wavesSpawned >= aiDirector.getWavesToSpawn()
    ) {
      return true;
    }

    return false;
  }

  didPlayersWin(aiDirector) {
    if (this.teamHealth[0] <= 0) {
      return false;
    }
    if (
      this.enemyUnitCount <= 0 &&
      this.wavesSpawned >= aiDirector.getWavesToSpawn()
    ) {
      return true;
    }

    return false;
  }

  getWavesSpawned() {
    return this.wavesSpawned;
  }

  incrementWavesSpawned(aiDirector) {
    this.wavesSpawned += 1;
    this.updateWavesSpawnedUI(aiDirector);
  }

  updateWavesSpawnedUI(aiDirector) {
    UIListeners.updateGameProgress(
      this.wavesSpawned / aiDirector.getWavesToSpawn()
    );
  }
}

BoardState.prototype.boardSize = {width: 600, height: 450};
