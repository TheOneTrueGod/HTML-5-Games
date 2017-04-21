class MainGame {
  constructor() {
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionActionCanvas = $('#missionActionDisplay');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';

    this.playerOrders = [];
  }

  start() {
    ServerCalls.LoadInitialBoard(this.handleInitialGameLoad, this);
  }
  // Step 2 -- Recieve call from server for initial load
  handleInitialGameLoad(boardState) {
    if (!boardState) {
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
        this.boardState = new BoardState();
        ServerCalls.SetupBoardAtGameStart(this.boardState, this);
        this.gameReadyToBegin();
      }
    } else {
      this.deserializeBoardState(boardState);
      this.gameReadyToBegin();
    }
  }
  // Step 3 -- deserialize the board state from the server
  deserializeBoardState(boardStateJSON) {
    this.boardState = new BoardState(boardStateJSON);
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
  }

  finalizeTurn() {
    $('#missionEndTurnButton').prop("disabled",true);
    ServerCalls.FinalizeTurn(this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    // Play Turn Out
    this.forcePlayTurn(this.finalizedTurnOver)
  }

  forcePlayTurn(finishedCallback) {
    finishedCallback.call(this);
  }

  addPlayerOrder(playerOrder) {
    var pID = playerOrder.getPlayerID();
    if (this.playerOrders[pID] === undefined) {
      this.playerOrders[pID] = [];
    }
    this.playerOrders[pID].push(playerOrder);
  }

  finalizedTurnOver() {
    $('#missionEndTurnButton').prop("disabled",false);
    this.boardState.incrementTurn();
    ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this);
  }
}

MainGame = new MainGame();

MainGame.start();
