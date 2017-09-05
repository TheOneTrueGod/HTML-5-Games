class Tester extends MainGame {
  start() {
    //this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
  }

  testAbility() {
    var abil1 = AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'projectile_type': ProjectileShape.ProjectileTypes.HIT,
      'hit_effects': [{
        'effect': ProjectileShape.HitEffects.INFECT,
        'duration': 100,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          angle_start: Math.PI + Math.PI / 8.0,
          angle_end: Math.PI * 2.0 - Math.PI / 8.0,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          bullet_speed: 6,
          num_bullets: 10,
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: 200
          }],
        }
      }]
    });

    var abil2 = AbilityDef.createFromJSON({
      name: 'Fireworks',
      description: 'Launches a projectile.<br>' +
        'It explodes into [[timeout_effects[0].abil_def.num_bullets]] bullets ' +
        ' that bounce [[timeout_effects[0].abil_def.max_bounces]] times.<br>' +
        'Each time, they deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] x [[timeout_effects[0].abil_def.max_bounces]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.TIMEOUT,
      icon: "../Bouncy/assets/icon_plain_burst.png",
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            projectile_type: ProjectileShape.ProjectileTypes.BOUNCE,
            max_bounces: 2,
            num_bullets: 12,
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 1000
              }],
          }
        }
      ],
      "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
    });
    this.abilitiesToUse = [
      [abil1.index, {x: 0, y: -30}],
      [abil2.index, {x: 0, y: -30}],
      null,
      null,
      null,
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
