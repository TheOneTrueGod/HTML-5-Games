class Tester extends MainGame {
  start() {
    //this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
  }

  testAbility() {
    var abil1 = AbilityDef.createFromJSON({
      name: 'Chaos Orb',
      description: 'Shoots an orb that rapidly decays.<br>' +
        'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage<br>' +
        'Afterwards, it explodes into another [[timeout_effects[0].abil_def.num_bullets]] projectiles',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]] + ' +
        '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      num_bullets: 50,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon:"../Bouncy/assets/icon_plain_forb.png",
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 40
        }
      ],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            projectile_type: ProjectileShape.ProjectileTypes.HIT,
            num_bullets: 11,
            gravity: {x: 0, y: 0},
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 40
              }],
          }
        }
      ],
    });
    this.abilitiesToUse = [
      [abil1.index, {x: 0, y: -30}],
      [abil1.index, {x: 0, y: -30}],
      [abil1.index, {x: 0, y: -30}],
      [abil1.index, {x: 0, y: -30}],
      [abil1.index, {x: 0, y: -30}],,
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
