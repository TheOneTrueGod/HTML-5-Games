class MainGame {
  constructor() {
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

  // Step 1 -- Load.
  loadImages(callback) {
    PIXI.loader
      .add("byte", "/CardsNMagic/assets/byte.png")
      .add("byte_red", "/CardsNMagic/assets/byte_red.png")
      .add("core", "/CardsNMagic/assets/core.png")
      .load(callback);
  }

  start() {
    ServerCalls.LoadInitialBoard(this.handleInitialGameLoad, this);
  }
  // Step 2 -- Recieve call from server for initial load
  handleInitialGameLoad(serializedGameData) {
    var gameData = JSON.parse(serializedGameData);
    if (!gameData.board_state) {
      if (!this.isHost) {
        // Server isn't ready yet.  We're not the host, so let's idle.
        var self = this;
        window.setTimeout(function() {
          self.loadInitialBoard();
        }, 3000);
        console.log("trying again");
      } else {
        // Server isn't ready yet.  We're the host, so let's
        // make it ready.
        this.boardState = new BoardState(this.stage);
        this.boardState.addInitialPlayers();
        ServerCalls.SetupBoardAtGameStart(this.boardState, this);
        this.gameReadyToBegin();
      }
    } else {
      this.deserializeGameData(gameData);
      this.gameReadyToBegin();
    }
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
          self.addPlayerCommand(PlayerCommand.FromServerData(
            commandJSON
          ));
        });
      }
    }
  }

  gameReadyToBegin() {
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
    $('#missionEndTurnButton').prop("disabled", true);
    ServerCalls.FinalizeTurn(this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    // Play Turn Out
    this.forcePlayTurn(this.finalizedTurnOver)
  }

  forcePlayTurn(finishedCallback) {
    this.tickOn = 0;

    this.doTick(finishedCallback);
  }

  doTick(finishedCallback) {
    this.tickOn += 1;
    this.boardState.runTick(this.playerCommands);

    if (this.tickOn >= 20) {
      finishedCallback.call(this);
    } else {
      window.setTimeout(this.doTick.bind(this, finishedCallback), 200);
    }
  }

  addPlayerCommand(playerCommand, saveCommand = true) {
    var pID = playerCommand.getPlayerID();
    if (this.playerCommands[pID] === undefined) {
      this.playerCommands[pID] = [];
    }
    this.playerCommands[pID].push(playerCommand);
    if (pID == this.playerID && saveCommand) {
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
    ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this);
  }
}

MainGame = new MainGame();

MainGame.loadImages(MainGame.start.bind(MainGame));
