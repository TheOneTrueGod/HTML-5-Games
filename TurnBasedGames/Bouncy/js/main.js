class MainGame {
  constructor() {
    this.ticksPerTurn = 20;
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
    this.playerID = $('#gameContainer').attr('playerID');

    //Create the renderer
    var mad = $('#missionActionDisplay');
    this.renderer = PIXI.autoDetectRenderer(mad.width(), mad.height());
    this.stage = new PIXI.Container();

    //Add the canvas to the HTML document
    mad.append(this.renderer.view);

    this.playerCommands = [];
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
    var reflectionLines = Physics.doLineReflections(x1, y1, angle, distance, lines);
    reflectionLines.forEach((line) => {
      returnLines.push(this.addLine(line, color));
    });

    return returnLines;
  }

  runLineTester() {
    var lines = [
      Line(0, 0, 0, 9999999),
      Line(0, 0, 9999999, 0),
      Line(500, 9999999, 500, 0),
    ];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      this.addLine(line);
      this.forceRedraw();
    }

    for (var i = 20; i < 32 * 3 - 20; i++) {
      this.testReflection(200, 300, Math.PI * i / 32.0, 750, lines, 0xffffff);
    }

    this.forceRedraw();
  }

  startGameLoading() {
    var self = this;

    GameInitializer.setHostNewGameCallback(function() {
      self.boardState = new BoardState(self.stage);
      self.boardState.addInitialPlayers(4);
      ServerCalls.SetupBoardAtGameStart(self.boardState, self);
    })
    .setLoadCompleteCallback(this.gameReadyToBegin.bind(this))
    .setLoadServerDataCallback(this.deserializeGameData.bind(this));

    var imageLoadCallback = function() {
      GameInitializer.start();
    };
    PIXI.loader
      .add("byte", "/Bouncy/assets/byte.png")
      .add("byte_red", "/Bouncy/assets/byte_red.png")
      .add("byte_diamond", "/Bouncy/assets/byte_diamond.png")
      .add("byte_diamond_red", "/Bouncy/assets/byte_diamond_red.png")
      .add("byte_octagon", "/Bouncy/assets/byte_octagon.png")
      .add("byte_octagon_red", "/Bouncy/assets/byte_octagon_red.png")
      .add("byte_square", "/Bouncy/assets/byte_square.png")
      .add("byte_square_red", "/Bouncy/assets/byte_square_red.png")
      .add("core", "/Bouncy/assets/core.png")
      .load(imageLoadCallback);
  }

  // Step 3 -- deserialize the board state from the server
  deserializeGameData(gameData) {
    var serverBoardState = JSON.parse(gameData.board_state);

    this.boardState = new BoardState(
      this.stage,
      serverBoardState
    );

    this.boardState.loadUnits(serverBoardState.units);

    var player_command_list = JSON.parse(gameData.player_commands);
    this.deserializePlayerCommands(player_command_list);
  }

  deserializePlayerCommands(player_command_list) {
    var self = this;
    for (var player_id in player_command_list) {
      if (player_command_list.hasOwnProperty(player_id)) {
        var command_list = player_command_list[player_id];
        command_list.forEach(function(commandJSON) {
          self.setPlayerCommand(
            PlayerCommand.FromServerData(commandJSON),
            false
          );
        });
      }
    }
  }

  gameReadyToBegin(finalized) {
    this.boardState.saveState();

    var $div; var $ability;

    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {
      "class": "abilityCard tempFirstAbil",
      "ability-id": 1,
    });
    $div.append($ability);
    $('#missionProgramDisplay').append($div);

    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {
      "class": "abilityCard tempSecondAbil",
      "ability-id": 2,
    });
    $div.append($ability);
    $('#missionProgramDisplay').append($div);

    UIListeners.setupUIListeners();
    this.renderer.render(this.stage);

    /*if (finalized) {
      this.playOutTurn();
    }*/
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
    var phase = !!currPhase ?
      TurnPhasesEnum.getNextPhase(currPhase) :
      TurnPhasesEnum.PLAYER_ACTION_1;

    if (phase == TurnPhasesEnum.NEXT_TURN) {
      this.finalizedTurnOver();
    } else {
      this.loopTicksForPhase(phase);
    }
  }

  loopTicksForPhase(phase) {
    var result = this.doTick(phase);
    if (result) {
      this.boardState.endPhase();
      this.playOutTurn.call(this, phase);
    } else {
      window.setTimeout(this.loopTicksForPhase.bind(this, phase), 20);
    }
  }

  doTick(phase) {
    if (
      phase == TurnPhasesEnum.ENEMY_SPAWN &&
      this.boardState.tick == 0
    ) {
      AIDirector.spawnForTurn(this.boardState);
    }
    if (
      phase == TurnPhasesEnum.ENEMY_MOVE &&
      this.boardState.tick == 0
    ) {
      AIDirector.giveUnitsOrders(this.boardState);
    }
    this.boardState.runTick(this.playerCommands, phase);
    return this.boardState.atEndOfPhase(this.playerCommands, phase);
  }

  setPlayerCommand(playerCommand, saveCommand) {
    var pID = playerCommand.getPlayerID();
    if (this.playerCommands[pID] === undefined) {
      this.playerCommands[pID] = [];
    }
    this.playerCommands[pID] = [playerCommand];
    if (
      pID == this.playerID &&
      (saveCommand === true || saveCommand === undefined)
    ) {
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

  forceRedraw() {
    this.renderer.render(this.stage);
  }

  finalizedTurnOver() {
    $('#missionEndTurnButton').prop("disabled", false);
    this.boardState.incrementTurn();
    this.boardState.saveState();
    ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this);
    this.forceRedraw();
  }
}

MainGame = new MainGame();

//MainGame.runLineTester();
MainGame.startGameLoading();
