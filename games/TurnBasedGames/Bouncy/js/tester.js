class Tester extends MainGame {
  start() {
    this.target = {x: 10, y: -20};
    this.loadImages(this.testAbility.bind(this));
  }

  testAbility() {
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'projectile_type': ProjectileShape.ProjectileTypes.FROZEN_ORB,
      'hit_effects': [{
        'effect': ProjectileShape.HitEffects.DAMAGE,
        'base_damage': 25
      }]
    });
    this.abilitiesToUse = [
      0,
      0,
      0,
      0,
      0,
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
      this.setPlayerCommand(
        new PlayerCommandUseAbility(
          (this.boardState.boardSize.width / 2) + this.target.x,
          (this.boardState.boardSize.height - 25) + this.target.y,
          abilIndex),
        false
      );
    }
    this.playOutTurn();
  }

  abilityTestReset() {
    this.boardState.reset();
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var newUnit = new UnitBasicSquare(75 + 50 * i, 75 + 50 * j, 0);
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
