class MainGame {
  constructor() {
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionActionCanvas = $('#missionActionDisplay');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
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
    UIListeners.setupUIListeners();
    var $div; var $ability;

    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {"class": "abilityDisplay tempFirstAbil"});
    $div.append($ability);
    $('#missionProgramDisplay').append($div);

    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {"class": "abilityDisplay tempSecondAbil"});
    $div.append($ability);
    $('#missionProgramDisplay').append($div);
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

  finalizedTurnOver() {
    $('#missionEndTurnButton').prop("disabled",false);
    this.boardState.incrementTurn();
    ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this);
  }
}

MainGame = new MainGame();

MainGame.start();
