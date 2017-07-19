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
      var shouldSpawn = Math.random() <= 0.8;
      if (!shouldSpawn) { continue; }
      var x = squareSize * i + squareSize / 2;
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
      var newUnit = new unitClass(x, -squareHeight, 0);
      boardState.addUnit(newUnit);
      newUnit.setMoveTarget(x, y);
    }
  }

  getWavesToSpawn() {
    return 20;
  }

  createInitialUnits(boardState) {
    const INITIAL_ROWS = 4;
    const squareSize = boardState.boardSize.width / this.HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;

    for (var y = 1; y < INITIAL_ROWS; y++) {
      for (var x = 1; x < this.HORIZONTAL_SQUARES; x++) {
        var shouldSpawn = Math.random() <= 0.3;
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
