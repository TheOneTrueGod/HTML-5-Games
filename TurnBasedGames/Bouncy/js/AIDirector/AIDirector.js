class AIDirector {
  spawnForTurn(boardState) {
    boardState.addUnit(new UnitBit(200, 10, 0));
    boardState.addUnit(new UnitBit(250, 10, 0));
    boardState.addUnit(new UnitBit(300, 10, 0));
    boardState.addUnit(new UnitBit(150, 10, 0));
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
