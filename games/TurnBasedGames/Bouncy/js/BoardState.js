const EMERGENCY_BREAK_TIME = 200;
const EFFECT_TICK_DELAY = 20;

const DO_TURNS_SIMULTANEOUSLY = true;
const SIMULTANEOUS_DELAY = 50;

class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.borderWalls = [
      new BorderWallLine(0, 0, 0, this.boardSize.height,  BorderWallLine.LEFT),
      new BorderWallLine(0, 0, this.boardSize.width, 0,  BorderWallLine.TOP),
      new BorderWallLine(this.boardSize.width, this.boardSize.height, this.boardSize.width, 0,  BorderWallLine.RIGHT),
      new BorderWallLine(0, this.boardSize.height, this.boardSize.width, this.boardSize.height, BorderWallLine.BOTTOM),
    ];
    this.playerCastPoints = [];
    this.effects = [];

    this.boardStateAtStartOfTurn = null;
    this.lastSpawnTurn = 0;

    this.sectors = new UnitSectors(9, 12, this.boardSize.width, this.boardSize.height);

    this.reset();
    this.deserialize(boardState);

    this.projectiles = [];
    this.unitsToSpawn = new UnitsToSpawn();

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
    var health = NumbersBalancer.getPlayerStat(
      NumbersBalancer.PLAYER_STATS.PLAYER_HEALTH
    );
    this.teamHealth = [health, health];
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
    if (boardState.units_to_spawn) {
      this.unitsToSpawn = UnitsToSpawn.deserialize(boardState.units_to_spawn);
    }
    if (boardState.last_spawn_turn) { this.lastSpawnTurn = boardState.last_spawn_turn; }
    if (boardState.random_seed) {
      this.randomSeed = boardState.random_seed;
    } else {
      this.resetRandomSeed();
    }
    if (boardState.player_data) {
      this.deserializePlayerData(boardState.player_data);
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

  incrementTurn(players) {
    this.turn += 1;
    UIListeners.updatePlayerStatus(this, players);
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
      'player_data': this.serializePlayerData(),
      'units_to_spawn': this.unitsToSpawn.serializeData(),
      'last_spawn_turn': this.lastSpawnTurn
    };
  }

  serializePlayerData() {
    var player_data = {};
    for (var key in MainGame.players) {
      var player = MainGame.players[key];
      player_data[key] = player.serializeData();
    }
    return player_data;
  }

  deserializePlayerData(dataJSON) {
    for (var key in MainGame.players) {
      var player = MainGame.players[key];
      if (key in dataJSON) {
        player.deserializeData(dataJSON[key]);
      }
    }
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

  getOffsetTickForPlayer(commands, playerID, players) {
    if (DO_TURNS_SIMULTANEOUSLY) {
      var playerTurns = this.getTurnOrderByPlayerIDs(commands, playerID, players)
      if (playerID in playerTurns) {
        return this.tick - playerTurns[playerID] * SIMULTANEOUS_DELAY
      }
      return this.tick;
    }

    return this.tick;
  }

  atEndOfPhase(players, playerCommands, phase) {
    /*if (this.noActionKillLimit > EMERGENCY_BREAK_TIME) {
      return true;
    }*/

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
          if (commands[i] && !commands[i].hasFinishedDoingEffect(
            this.getOffsetTickForPlayer(commands, commands[i].playerID, players))
          ) {
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

  endOfPhase(players, phase) {
    this.resetNoActionKillSwitch();
    for (var unit in this.units) {
      this.units[unit].endOfPhase(this, phase);
    }
    if (phase === TurnPhasesEnum.ENEMY_SPAWN) {
      for (var key in players) {
        players[key].endOfTurn();
      }
    }
    this.doDeleteChecks();
  }

  doDeleteChecks() {
    var i = 0;
    while (i < this.units.length) {
      if (this.units[i].readyToDelete()) {
        EffectFactory.createUnitDyingEffect(this, this.units[i]);
        this.units[i].onDelete(this);
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

  getTurnOrder(players) {
    var player_order = [];
    for (var i = 0; i < players.length; i++) {
      player_order.push((parseInt(players[i].player_index) + this.turn - 1) % players.length);
    }
    return player_order;
  }

  getPlayerActionsInPhase(players, playerCommands, phase) {
    if (DO_TURNS_SIMULTANEOUSLY && phase === TurnPhasesEnum.PLAYER_ACTION_1) {
      var commands = [];
      for (var key in players) {
        var pc = playerCommands[players[key].getUserID()];
        if (pc) {
          commands = commands.concat(pc);
        }
      }
      return commands;
    }
    var turnOrder = this.getTurnOrder(players);
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

  getTurnOrderByPlayerIDs(playerCommands, playerID, players) {
    var turnOrder = this.getTurnOrder(players);
    var playerTurnOrder = {};
    var playersAssigned = 0;
    for (var i = 0; i < turnOrder.length; i++) {
      var currPlayer = players[turnOrder[i]];
      if (currPlayer) {
        var commandByPlayer = playerCommands.find((command) => { return command.playerID === currPlayer.user_id});
        if (commandByPlayer) {
          playerTurnOrder[players[turnOrder[i]].getUserID()] = playersAssigned;
          playersAssigned += 1;
        }
      }
    }
    return playerTurnOrder;
  }

  doPlayerActions(players, playerCommands, phase) {
    var commands = this.getPlayerActionsInPhase(players, playerCommands, phase);

    if (commands) {
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        var tick = this.tick;
        if (command) {
          command.doActionOnTick(
            this.getOffsetTickForPlayer(commands, commands[i].playerID, players),
            this
          );
        }
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
  
  addEffect(effect) {
    effect.addToStage(this.stage);
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
    this.lastSpawnTurn = this.turn;
    this.updateWavesSpawnedUI(aiDirector);
  }

  updateWavesSpawnedUI(aiDirector) {
    UIListeners.updateGameProgress(
      this.wavesSpawned / aiDirector.getWavesToSpawn()
    );
  }
}

BoardState.prototype.boardSize = {width: 600, height: 450};
