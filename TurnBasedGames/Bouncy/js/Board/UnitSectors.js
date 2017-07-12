class UnitSectors {
  constructor(rows, columns, width, height) {
    this.boardWidth = width;
    this.boardHeight = height;
    this.rows = rows;
    this.columns = columns;
    this.sectorWidth = width / columns;
    this.sectorHeight = height / rows;
    this.reset();
  }

  reset() {
    this.grid = {};
    this.units = {};
  }

  addUnit(unit) {
    var tl = unit.getTopLeft();
    var sectorTL = Victor(
      Physics.truncate(tl.x / this.boardWidth * this.columns),
      Physics.truncate(tl.y / this.boardHeight * this.rows)
    );

    var br = unit.getBottomRight();
    var sectorBR = Victor(
      Physics.truncate(br.x / this.boardWidth * this.columns),
      Physics.truncate(br.y / this.boardHeight * this.rows)
    );

    for (var column = sectorTL.x; column <= sectorBR.x; column++) {
      for (var row = sectorTL.y; row <= sectorBR.y; row++) {
        this.ensureExists(row, column);
        this.grid[row][column].push(unit.id);
        if (!(unit.id in this.units)) {
          this.units[unit.id] = [];
        }
        this.units[unit.id].push({row: row, column: column});
      }
    }
  }

  removeUnit(unit) {
    if (!(unit.id in this.units)) {
      return;
    }
    for (var i = 0; i < this.units[unit.id].length; i++) {
      var spot = this.units[unit.id][i];
      if (spot.row in this.grid && spot.column in this.grid[spot.row]) {
        var index = this.grid[spot.row][spot.column].indexOf(unit.id);
        if (index != -1) {
          this.grid[spot.row][spot.column].splice(index, 1);
        } else {
          console.log("Something's up");
        }
      }
    }
    delete this.units[unit.id];
  }

  ensureExists(row, column) {
    if (!(row in this.grid)) {
      this.grid[row] = {};
    }

    if (!(column in this.grid[row])) {
      this.grid[row][column] = [];
    }
  }

  getUnitsAtPosition(x, y) {
    var column = Physics.truncate(x / this.boardWidth * this.columns);
    var row = Physics.truncate(y / this.boardHeight * this.rows);

    if (row in this.grid && column in this.grid[row]) {
      return this.grid[row][column];
    }
    return [];
  }
}
