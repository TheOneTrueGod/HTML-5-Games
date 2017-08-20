class NumbersBalancer {
  constructor() {
    this.num_players = 4;
    this.difficulty = this.DIFFICULTIES.MEDIUM;
  }

  setNumPlayers(num_players) {
    this.num_players = num_players;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getUnitDamage(unit) {
    var damage = 1;
    if (unit.constructor.name == "UnitHeavy") { damage = 3; }
    if (unit.constructor.name == "UnitBomber") { damage = 10; }
    ///if (unit.constructor.name == "UnitFast") { damage = 2; }
    return damage;
  }

  getUnitSpeed(unit) {
    var speedVal = 1;
    //if (unit.constructor.name == "UnitHeavy") { speedVal = 0.5; }
    if (unit.constructor.name == "UnitFast") { speedVal = 2; }
    return speedVal;
  }

  getUnitHealth(unit) {
    var healthMultiplier = 1;
    if (this.num_players == 1) { healthMultiplier *= 1; }
    if (this.num_players == 2) { healthMultiplier *= 2; }
    if (this.num_players == 3) { healthMultiplier *= 3; }
    if (this.num_players == 4) { healthMultiplier *= 4; }

    if (this.difficulty == this.DIFFICULTIES.EASY) { healthMultiplier *= 0.75; }
    if (this.difficulty == this.DIFFICULTIES.MEDIUM) { healthMultiplier *= 1; }
    if (this.difficulty == this.DIFFICULTIES.HARD) { healthMultiplier *= 1.25; }
    if (this.difficulty == this.DIFFICULTIES.NIGHTMARE) { healthMultiplier *= 1.5; }

    var healthVal = 100;
    switch (unit.constructor.name) {
      case "UnitBasicSquare":
      case "UnitBasicDiamond":
        healthVal = 100;
        break;
      case "UnitFast":
        healthVal = 75;
        break;
      case "UnitHeavy":
        healthVal = 200;
        break;
      case "UnitShooter":
        healthVal = 150;
        break;
      case "UnitShover":
        healthVal = 150;
        break;
      case "UnitBomber":
      healthVal = 400;
    }
    return Math.floor(healthVal * healthMultiplier);
  }
}

NumbersBalancer.prototype.DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  NIGHTMARE: 'nightmare',
}

NumbersBalancer = new NumbersBalancer();
