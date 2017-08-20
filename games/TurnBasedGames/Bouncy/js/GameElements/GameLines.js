class GameLine extends Line {

}

class BorderWallLine extends Line {

}

class UnitLine extends Line {
  constructor(x1, y1, x2, y2, unit) {
    super(x1, y1, x2, y2);
    this.unit = unit;
  }

  clone() {
    return new UnitLine(this.x1, this.y1, this.x2, this.y2, this.unit);
  }
}

class UnitCriticalLine extends UnitLine {
  constructor(x1, y1, x2, y2, unit, damageMult) {
    super(x1, y1, x2, y2, unit);
    this.damageMultiplier = damageMult ? damageMult : 2;
  }

  getCriticalMultiplier() {
    return this.damageMultiplier;
  }

  clone() {
    return new UnitCriticalLine(this.x1, this.y1, this.x2, this.y2, this.unit, this.damageMultiplier);
  }
}
