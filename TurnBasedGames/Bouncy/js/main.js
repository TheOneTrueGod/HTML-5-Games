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
      .add("byte", "/CardsNMagic/assets/byte.png")
      .add("byte_red", "/CardsNMagic/assets/byte_red.png")
      .add("core", "/CardsNMagic/assets/core.png")
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

  gameReadyToBegin() {
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
  }

  finalizeTurn() {
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true);
    ServerCalls.FinalizeTurn(this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    // Play Turn Out
    this.forcePlayTurn(this.finalizedTurnOver)
  }

  forcePlayTurn(finishedCallback) {
    this.doTick(function() {
      window.setTimeout(this.forcePlayTurn.bind(this, finishedCallback), 200);
    }, finishedCallback);
  }

  doTick(tickOverCallback, finishedCallback) {
    AIDirector.runTick();
    this.boardState.runTick(this.playerCommands);
    if (this.boardState.atEndOfTurn(this.playerCommands)) {
      finishedCallback.call(this);
    } else {
      tickOverCallback.call(this);
    }
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
  }
}

MainGame = new MainGame();

MainGame.startGameLoading();
