/*
 * TODO;
 * Create projectile styles
 * Move the decks back to the client side while I'm still developing
 * Create sean's deck
 * Add google ads to the sides
 * Make projectiles that can pass through the border walls based on gravity
 * The rain ability feels kinda shitty
 * Right now it's just picking one ability and you go.  Maybe have a way to select multiple abilities?
 * Invulnerable enemies that deal no damage as a wall
 * New enemy type -- infected.  When it dies, it explodes into a bunch of smaller minions.
 */
class MainGame {
  constructor() {
    this.ticksPerTurn = 20;
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
    this.playerID = $('#gameContainer').attr('playerID');
    this.isFinalized = false;
    this.playingOutTurn = false;

    this.aimPreview = null;
    this.gameStarted = false;

    //Create the renderer
    var mad = $('#missionActionDisplay');
    this.renderer = PIXI.autoDetectRenderer(mad.width(), mad.height());
    this.stage = new PIXI.Container();

    //Add the canvas to the HTML document
    mad.append(this.renderer.view);

    this.playerCommands = [];
    this.players = {};

    this.TICK_DELAY = 20;
    this.DEBUG_SPEED = 1;

    UIListeners.setupPlayerInitListeners();
  }

  addLine(line, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    this.stage.addChild(lineGraphic);

    // Move it to the beginning of the line
    lineGraphic.position.set(line.x1, line.y1);

    // Draw the line (endPoint should be relative to myGraph's position)
    lineGraphic.lineStyle(1, color)
           .moveTo(0, 0)
           .lineTo(line.x2 - line.x1, line.y2 - line.y1);
    return lineGraphic;
  }

  testReflection(x1, y1, angle, distance, lines, color) {
    var returnLines = [];
    var reflectionLines = Physics.doLineReflections(x1, y1, angle, distance, lines, undefined, () => { return true; });
    reflectionLines.reflection_lines.forEach((line) => {
      returnLines.push(this.addLine(line, color));
    });

    return returnLines;
  }

  runLineTester() {
    UIListeners.showGameBoard();
    this.testlines = [
      //new Line(0, 0, 0, 9999999),
      //new Line(0, 0, 9999999, 0),
      //new Line(500, 9999999, 500, 0),
      new Line(475, 50, 500, 75),
    ];
    for (var i = 0; i < this.testlines.length; i++) {
      var line = this.testlines[i];
      this.addLine(line, 0x00ff00);
    }

    this.testReflection(480.1107320268968, 53.816015252685766, 1.87667519819892,
      6, this.testlines, 0xffffff);
  }

  start() {
    var self = this;

    GameInitializer.setHostNewGameCallback(function() {
      self.boardState = new BoardState(self.stage);
      self.boardState.addInitialPlayers(self.players);
      AIDirector.createInitialUnits(self.boardState);
      ServerCalls.SetupBoardAtGameStart(self.boardState, self, AIDirector);
    })
    .setLoadCompleteCallback(this.gameReadyToBegin.bind(this))
    .setLoadServerDataCallback(this.deserializeGameData.bind(this))
    .setPlayerDataLoadedCallback(this.playerDataLoadedCallback.bind(this))
    .setGameNotStartedCallback(this.gameNotStartedCallback.bind(this));

    this.loadImages(() => { GameInitializer.start() });
  }

  loadImages(callback) {
    PIXI.loader
      .add("byte", "../Bouncy/assets/byte.png")
      .add("byte_diamond_red", "../Bouncy/assets/byte_diamond_red.png")
      .add("byte_square_red", "../Bouncy/assets/byte_square_red.png")
      .add("enemy_square",  "../Bouncy/assets/enemy_square.png")
      .add("enemy_fast",  "../Bouncy/assets/enemy_fast.png")
      .add("enemy_diamond",  "../Bouncy/assets/enemy_diamond.png")
      .add("enemy_shoot",  "../Bouncy/assets/enemy_shoot.png")
      .add("enemy_shover",  "../Bouncy/assets/enemy_shover.png")
      .add("enemy_strong",  "../Bouncy/assets/enemy_strong.png")
      .add("enemy_bomber",  "../Bouncy/assets/enemy_bomber.png")
      .add("enemy_knight",  "../Bouncy/assets/enemy_knight.png")
      .add("zone_shield",  "../Bouncy/assets/zone_shield.png")
      .add("enemy_protector",  "../Bouncy/assets/enemy_protector.png")
      .add("zone_energy_shield",  "../Bouncy/assets/zone_energy_shield.png")
      .add("core", "../Bouncy/assets/core.png")
      .add("sprite_explosion",  "../Bouncy/assets/sprites/explosion.png")
      .load(callback);
  }

  // Step 3 -- deserialize the board state from the server
  deserializeGameData(gameData) {
    var serverBoardState = JSON.parse(gameData.board_state);

    this.boardState = new BoardState(
      this.stage,
      serverBoardState
    );

    this.isFinalized = gameData.finalized;

    this.boardState.loadUnits(serverBoardState.units);

    var player_command_list = JSON.parse(gameData.player_commands);
    this.deserializePlayerCommands(player_command_list, true);
  }

  deserializePlayerCommands(player_command_list, ignoreSelf = false) {
    this.removeAllPlayerCommands();
    this.playerCommands = [];
    var self = this;
    for (var player_id in player_command_list) {
      if (
        player_command_list.hasOwnProperty(player_id) &&
        (!ignoreSelf ||
          player_id != this.playerID ||
          !this.playerCommands[player_id]
        )
      ) {
        var command_list = player_command_list[player_id];
        command_list.forEach(function(commandJSON) {
          self.setPlayerCommand(
            PlayerCommand.FromServerData(commandJSON),
            false
          );
        });
      }
    }

    this.checkForAutoEndTurn();

    UIListeners.updatePlayerCommands(player_command_list, this.players);
  }

  checkForAutoEndTurn() {
    if (!this.gameStarted || this.playingOutTurn || !this.isHost) { return; }
    var allPlayersHaveCommand = true;
    for (var key in this.players) {
      if (!this.playerCommands[this.players[key].getUserID()]) {
        allPlayersHaveCommand = false;
      }
    }

    if (allPlayersHaveCommand && this.players.length > 0) {
      TurnControls.setPlayState(false);
      this.finalizeTurn();
    }
  }

  removeAllPlayerCommands() {
    for (var key in this.playerCommands) {
      this.playerCommands[key].forEach((command) => {
        command.removeAimIndicator(this.stage);
      })
    }
  }

  playerDataLoadedCallback(player_data) {
    this.updatePlayerData(player_data);

    UIListeners.createPlayerStatus(this.players);
    UIListeners.createAbilityDisplay(this.players);
  }

  updatePlayerData(player_data) {
    this.players = [];
    var num_players = 0;
    AbilityDef.ABILITY_DEF_INDEX = 0;
    AbilityDef.abilityDefList = {};
    UnitBasic.createAbilityDefs();
    for (var key in player_data) {
      if (!player_data[key]) {
        continue;
      }
      num_players += 1;
      var playerData = JSON.parse(player_data[key]);
      var newPlayer = Player(playerData, key);
      this.players[key] = newPlayer;
    }
    NumbersBalancer.setNumPlayers(num_players);
  }

  gameNotStartedCallback(metaData) {
    this.updatePlayerData(metaData.player_data);
    UIListeners.setOtherDecks(metaData.other_decks);
    NumbersBalancer.setDifficulty(metaData.difficulty ? metaData.difficulty : NumbersBalancer.MEDIUM);
    UIListeners.updateGameSetupScreen(this.players);
  }

  gameReadyToBegin(finalized) {
    UIListeners.updatePlayerStatus(this.boardState, this.players);
    UIListeners.showGameBoard();
    this.boardState.saveState();
    this.boardState.updateWavesSpawnedUI(AIDirector);

    UIListeners.setupUIListeners();
    this.renderer.render(this.stage);
    this.gameStarted = true;
    if (this.isFinalized) {
      this.playOutTurn();
    } else {
      this.getTurnStatus();
      this.checkForAutoEndTurn();
    }

    if (this.boardState.isGameOver(AIDirector)) {
      $('#missionEndTurnButton').prop("disabled", true);
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector));
    }
  }

  getTurnStatus() {
    if (!this.boardState.isGameOver(AIDirector)) {
      ServerCalls.GetTurnStatus(this.recieveTurnStatus, this);
    }
  }

  recieveTurnStatus(response) {
    var turnData = JSON.parse(response);

    var player_command_list = JSON.parse(turnData.player_commands);
    this.deserializePlayerCommands(player_command_list);
    this.isFinalized = turnData.finalized;
    if (
      turnData.finalized &&
      this.boardState.turn <= turnData.current_turn &&
      !this.isHost
    ) {
      this.playOutTurn();
    } else if (!this.playingOutTurn) {
      window.setTimeout(this.getTurnStatus.bind(this), 1000);
    }
  }

  finalizeTurn() {
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true);
    ServerCalls.FinalizeTurn(this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    // phases
    this.playOutTurn();
  }

  playOutTurn(currPhase) {
    if (this.playingOutTurn && !currPhase) { return; }
    if (!currPhase) {
      $('#gameContainer').addClass("turnPlaying");
      this.removeAllPlayerCommands();
    }

    this.playingOutTurn = true;
    if (currPhase) {
      this.boardState.endOfPhase(this.players, currPhase);
    }
    var phase = !!currPhase ?
      TurnPhasesEnum.getNextPhase(currPhase) :
      TurnPhasesEnum.PLAYER_ACTION_1;

    this.startOfPhase(phase);

    if (phase == TurnPhasesEnum.NEXT_TURN) {
      this.finalizedTurnOver();
    } else {
      this.loopTicksForPhase(phase);
    }
  }

  startOfPhase(phase) {
    if (phase == TurnPhasesEnum.ENEMY_MOVE) {
      AIDirector.giveUnitsOrders(this.boardState);
    }
    if (phase == TurnPhasesEnum.ENEMY_MOVE) {
      AIDirector.spawnForTurn2(this.boardState);
    }

    if (phase == TurnPhasesEnum.ENEMY_ACTION) {
      this.boardState.doUnitActions(this.boardState);
    }

    this.boardState.startOfPhase(phase);
  }

  loopTicksForPhase(phase) {
    var result = this.doTick(phase);
    if (result) {
      this.boardState.endPhase();
      this.playOutTurn.call(this, phase);
    } else {
      window.setTimeout(this.loopTicksForPhase.bind(this, phase), this.TICK_DELAY);
    }
  }

  doTick(phase) {
    this.boardState.runTick(this.players, this.playerCommands, phase);
    return this.boardState.atEndOfPhase(this.players, this.playerCommands, phase);
  }

  setAimPreview(x, y, abilityIndex) {
    if (this.aimPreview) {
      this.aimPreview.removeAimIndicator();
    }
    if (abilityIndex !== null) {
      this.aimPreview = new PlayerCommandUseAbility(x, y, abilityIndex);
      this.aimPreview.addAimIndicator(this.boardState, this.stage, this.players);
    } else {
      this.aimPreview = null;
    }
  }

  setPlayerCommand(playerCommand, saveCommand) {
    var pID = playerCommand.getPlayerID();
    if (!this.playerCommands[pID]) {
      this.playerCommands[pID] = [];
    } else {
      this.playerCommands[pID].forEach((command) => {
        command.removeAimIndicator(this.stage);
      });
    }
    this.playerCommands[pID] = [playerCommand];
    if (!$('#gameContainer').hasClass("turnPlaying")) {
      if (pID !== this.playerID || !this.aimPreview) {
        this.playerCommands[pID].forEach((command) => {
          command.addAimIndicator(this.boardState, this.stage, this.players);
        });
      } else if (pID == this.playerID && this.aimPreview) {
        this.aimPreview.addAimIndicator(this.boardState, this.stage, this.players);
      }
    }

    if (
      pID == this.playerID &&
      (saveCommand === true || saveCommand === undefined)
    ) {
      UIListeners.updatePlayerCommands(this.playerCommands, this.players);
      ServerCalls.SavePlayerCommands(
        this.boardState,
        this.playerCommands[pID].map(
          function(playerCommand) {
            return playerCommand.serialize();
          }
        )
      );
    }
  }

  redraw() {
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.redraw.bind(this));
  }

  finalizedTurnOver() {
    $('#gameContainer').removeClass("turnPlaying");
    if (!this.boardState.isGameOver(AIDirector)) {
      $('#missionEndTurnButton').prop("disabled", false);
    } else {
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector));
    }

    this.boardState.incrementTurn(this.players);
    this.boardState.saveState();
    if (this.isHost) {
      ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this, AIDirector);
    }
    this.removeAllPlayerCommands();
    this.playerCommands = [];
    this.isFinalized = false;
    this.playingOutTurn = false;

    UIListeners.updatePlayerCommands(this.playerCommands, this.players);
    this.getTurnStatus();
  }

  debugSpeed() {
    this.TICK_DELAY = 40;
    this.DEBUG_SPEED = 2;
  }

  runRandomTester() {
    var boardState = new BoardState();
    var buckets = {};
    var wl = [
      {value: 1, weight: 5},
      {value: 2, weight: 2},
      {value: 3, weight: 2},
      {value: 4, weight: 1}
    ];
    for (var i = 0; i < 100; i++) {
      var r = AIDirector.getRandomFromWeightedList(Math.random(), wl);

      if (!(r in buckets)) {
        buckets[r] = 0;
      }
      buckets[r] += 1;
    }
    var key = {};
    for (var i = 0; i < wl.length; i++) {
      key[wl[i].value] = wl[i].weight;
    }
  }
}
