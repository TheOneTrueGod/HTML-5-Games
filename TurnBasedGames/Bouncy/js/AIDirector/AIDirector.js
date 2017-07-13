class AIDirector {
  spawnForTurn(boardState) {
    const NUM_SPOTS = 12;
    const squareSize = boardState.boardSize.width / NUM_SPOTS;
    for (var i = 0; i < NUM_SPOTS; i++) {
      var x = squareSize * i + squareSize / 2;
      var unitClass = UnitBasic;
      var r = Math.floor(Math.random() * 5);
      switch (r) {
        case 0:
        case 1:
          unitClass = UnitBasic;
          break;
        case 2:
        case 3:
          unitClass = UnitBasicSquare;
          break;
      }
      boardState.addUnit(new unitClass(x, 40, 0));
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
