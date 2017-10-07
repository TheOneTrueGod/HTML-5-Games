class Tester extends MainGame {
  start() {
    this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
  }

  testAbility() {
    var abils = ClarenceDeck();
    // SET COMMANDS HERE
    this.abilitiesToUse = [
      ["move", {x: 0, y: -50}],
      ['move', {x: 0, y: -100}],
      ['move', {x: 0, y: -150}],
    ];

    // END SET COMMANDS HERE
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
        self.boardState.turn += 1;
        if (self.turnsPlayed > 5) {
          self.boardState.loadState();
          self.boardState.teamHealth = [40, 40];
          UIListeners.updateTeamHealth(40, 40);
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
      if (abilIndex[0] == "move") {
          this.setPlayerCommand(
            new PlayerCommandMove(
              (this.boardState.boardSize.width / 2) + target.x,
              (this.boardState.boardSize.height - 25) + target.y
            ),
            false
          );
      } else {
        this.setPlayerCommand(
          new PlayerCommandUseAbility(
            (this.boardState.boardSize.width / 2) + target.x,
            (this.boardState.boardSize.height - 25) + target.y,
            abilIndex[0],
            $('#gameContainer').attr('playerID')
          ),
          false
        );
      }
    }
    this.playOutTurn();
  }

  abilityTestReset() {
    this.boardState.reset();
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var unitType = UnitBasicSquare;
        if (i == 1 && j == 1) {
          unitType = UnitBomber;
        //} else if (i == 1 && j == 2 || i == 0 && j == 1) {
        //  unitType = UnitKnight;
        //} else if (i == 1 && j == 0) {
        //  unitType = UnitShooter;
        }

        var newUnit = new unitType(75 + 50 * i, 75 + 50 * j, 0);

        this.boardState.addUnit(newUnit);
      }
    }

    var newCore = new UnitCore(
      BoardState.prototype.boardSize.width / 2,
      BoardState.prototype.boardSize.height - 25,
      'totg'
    );
    this.boardState.addUnit(newCore);
  }
}

MainGame = new Tester();
MainGame.redraw();

MainGame.start();
