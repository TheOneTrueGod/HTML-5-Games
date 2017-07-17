class AIDirector {
  spawnForTurn(boardState) {
    const NUM_SPOTS = 12;
    const squareSize = boardState.boardSize.width / NUM_SPOTS;
    const squareHeight = boardState.boardSize.height / NUM_SPOTS;
    var y = squareHeight + squareHeight / 2;
    for (var i = 0; i < NUM_SPOTS; i++) {
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

  giveUnitsOrders(boardState) {
    for (var i = 0; i < boardState.units.length; i++) {
      var unit = boardState.units[i];
      if (!(unit instanceof UnitCore)) {
        unit.doMovement(boardState);
      }
    }
  }
}

AIDirector = new AIDirector();
