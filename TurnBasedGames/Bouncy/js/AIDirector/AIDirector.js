class AIDirector {
  constructor() {
    this.HORIZONTAL_SQUARES = 12;
  }

  spawnForTurn(boardState) {
    const NUM_SPOTS = 12;
    const squareSize = boardState.boardSize.width / this.HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;
    if (boardState.wavesSpawned >= this.getWavesToSpawn()) {
      return;
    }
    boardState.incrementWavesSpawned(this);

    var y = squareHeight + squareHeight / 2;
    for (var i = 0; i < this.HORIZONTAL_SQUARES; i++) {
      var shouldSpawn = boardState.getRandom() <= 0.8;
      if (!shouldSpawn) { continue; }
      var x = squareSize * i + squareSize / 2;
      for (var dx = 0; dx < this.HORIZONTAL_SQUARES; dx ++) {
        if (this.tryToSpawn(boardState, {x: x + dx * squareSize, y: y})) {
          return;
        }
        if (this.tryToSpawn(boardState, {x: x - dx * squareSize, y: y})) {
          return;
        }
      }
    }
  }

  tryToSpawn(boardState, position, triedShoving) {
    const squareSize = boardState.boardSize.width / this.HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;

    if (position.x < 0 || position.x >= this.HORIZONTAL_SQUARES * squareSize) {
      return false;
    }

    if (
      boardState.sectors.getUnitsAtPosition(position.x, position.y).length > 0
    ) {
      if (position.y > squareHeight) {
        return this.tryToSpawn(
          boardState,
          {x: position.x, y: position.y - squareHeight}
        );
      } else if (!triedShoving) {
        // TODO: Try this later
        //boardState.shoveUnits({x: position.x, y: position.y}, {x: 0, y: 1});
        /*return this.tryToSpawn(
          boardState,
          {x: position.x, y: position.y},
          true
        );*/
      }

      return false;
    }

    var unitClass = UnitBasicSquare;
    var r = Math.floor(Math.random() * 5);
    switch (r) {
      case 0:
        unitClass = UnitBasic;
        break;
      case 1:
      case 2:
      case 3:
        unitClass = UnitBasicSquare;
        break;
    }
    var newUnit = new unitClass(position.x, position.y - squareHeight * 2, 0);
    newUnit.setMoveTarget(position.x, position.y);
    boardState.addUnit(newUnit);
    return true;
  }

  getWavesToSpawn() {
    return 20;
  }

  createInitialUnits(boardState) {
    const INITIAL_ROWS = 4;
    const squareSize = boardState.boardSize.width / this.HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;

    for (var y = INITIAL_ROWS - 1; y >= 1; y--) {
      for (var x = 0; x < this.HORIZONTAL_SQUARES; x++) {
        var shouldSpawn = boardState.getRandom() <= 0.3;
        if (!shouldSpawn) { continue; }

        var unitClass = UnitBasicSquare;
        var newUnit = new unitClass(
          x * squareSize + squareSize / 2,
          y * squareHeight + squareHeight / 2,
          0
        );
        boardState.addUnit(newUnit);
      }
    }
  }

  giveUnitsOrders(boardState) {
    boardState.units.sort((unit, unit2) => {
      return unit.y < unit2.y ? 1 : -1;
    });
    for (var i = 0; i < boardState.units.length; i++) {
      var unit = boardState.units[i];
      if (!(unit instanceof UnitCore)) {
        unit.doMovement(boardState);
      }
    }
  }

  levelComplete(boardState) {
    return boardState.wavesSpawned > this.getWavesToSpawn();
  }
}

AIDirector = new AIDirector();
