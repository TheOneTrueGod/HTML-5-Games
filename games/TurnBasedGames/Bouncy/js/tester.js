class Tester extends MainGame {
  start() {
    //this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
  }

  testAbility() {
    var abils = TJDeck();
    this.abilitiesToUse = [
      [abils[3].index, {x: 0, y: -30}],
      [abils[3].index, {x: 0, y: -30}],
      [abils[3].index, {x: 0, y: -30}],
      [abils[3].index, {x: 0, y: -30}],
      [abils[3].index, {x: 0, y: -30}],
    ];
    UIListeners.showGameBoard();
    var width = 50 * 5; var height = 50 * 9;
    BoardState.prototype.boardSize = {width: width, height: height};
    this.boardState = new BoardState(this.stage);
    this.boardState.sectors = new UnitSectors(9, 5, width, height);

    this.players[0] = Player({user_name: 'totg', user_id: 'totg'}, 'totg');
    //this.TICK_DELAY = 10;
    this.abilityTestReset();

    AIDirector.spawnForTurn = function() {} ;
    AIDirector.spawnForTurn2 = function() {} ;
    var self = this;
    this.turnsPlayed = 0;
    self.boardState.saveState();
    this.finalizedTurnOver = function() {
      window.setTimeout(function() {
        self.playingOutTurn = false;
        self.turnsPlayed += 1;
        if (self.turnsPlayed > 5) {
          self.boardState.loadState();
          self.boardState.teamHealth = [40, 40];
          UIListeners.updateTeamHealth(1);
          self.turnsPlayed = 0;
        }
        self.abilityTestRunCommands();
      }, 500);
    }
    this.abilityTestRunCommands();
  }

  abilityTestRunCommands() {
    this.playerCommands = [];
    var abilIndex = this.abilitiesToUse[this.turnsPlayed];
    if (abilIndex !== undefined && abilIndex !== null) {
      var target = abilIndex[1];
      this.setPlayerCommand(
        new PlayerCommandUseAbility(
          (this.boardState.boardSize.width / 2) + target.x,
          (this.boardState.boardSize.height - 25) + target.y,
          abilIndex[0]),
        false
      );
    }
    this.playOutTurn();
  }

  abilityTestReset() {
    this.boardState.reset();
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var unitType = UnitBasicSquare;
        if (i == 1 && j == 1) {
          unitType = UnitProtector;
        //} else if (i == 1 && j == 2 || i == 0 && j == 1) {
        //  unitType = UnitKnight;
        } else if (i == 1 && j == 0) {
          unitType = UnitShooter;
        }

        var newUnit = new unitType(75 + 50 * i, 75 + 50 * j, 0);

        this.boardState.addUnit(newUnit);
      }
    }
    var newCore = new UnitCore(
      20,//BoardState.prototype.boardSize.width / 2,
      BoardState.prototype.boardSize.height - 25,
      'totg'
    );
    this.boardState.addUnit(newCore);
  }
}

MainGame = new Tester();
MainGame.redraw();

MainGame.start();
