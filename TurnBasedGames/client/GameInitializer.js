class GameInitializer {
  constructor() {
    this.hostNewGameCallback = null;
    this.loadCompleteCallback = null;
    this.loadServerDataCallback = null;
    this.playerDataLoadedCallback = null;
    this.isHost = $('#gameContainer').attr('host') === 'true';
  }
  // Step 1.  Load the current board state from the server
  start() {
    ServerCalls.LoadGameMetaData(this.handleMetaDataLoaded, this);
  }

  handleMetaDataLoaded(serializedMetaData) {
    var metaData = JSON.parse(serializedMetaData);
    if (metaData.player_data) {
      this.playerDataLoadedCallback(metaData.player_data);
    }
    this.loadInitialBoard();
  }

  loadInitialBoard() {
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
        if (this.hostNewGameCallback !== null) {
          this.hostNewGameCallback();
        }
        if (this.loadCompleteCallback !== null) {
          this.loadCompleteCallback(false);
        }
      }
    } else {
      if (this.loadServerDataCallback !== null) {
        this.loadServerDataCallback(gameData);
      }
      if (this.loadCompleteCallback !== null) {
        this.loadCompleteCallback(gameData.finalized);
      }
    }
  }

  setHostNewGameCallback(callback) {
    this.hostNewGameCallback = callback;
    return this;
  }

  setLoadCompleteCallback(callback) {
    this.loadCompleteCallback = callback;
    return this;
  }

  setLoadServerDataCallback(callback) {
    this.loadServerDataCallback = callback;
    return this;
  }

  setPlayerDataLoadedCallback(callback) {
    this.playerDataLoadedCallback = callback;
    return this;
  }
}

GameInitializer = new GameInitializer();
