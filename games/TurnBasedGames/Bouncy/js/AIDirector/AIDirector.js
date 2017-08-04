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

    const numToExclude = Math.floor(boardState.getRandom() * 3);

    var spawnSlots = [];
    for (var i = 0; i < NUM_SPOTS; i++) { spawnSlots.push(i); }
    for (var i = 0; i < numToExclude; i++) {
      spawnSlots.splice(Math.floor(boardState.getRandom() * spawnSlots.length), 1);
    }

    var y = squareHeight + squareHeight / 2;
    for (var i = 0; i < spawnSlots.length; i++) {
      var spot = spawnSlots[i];
      var x = squareSize * spot + squareSize / 2;
      for (var dx = 0; dx < this.HORIZONTAL_SQUARES; dx ++) {
        if (this.tryToSpawn(boardState, {x: x + dx * squareSize, y: y})) {
          break;
        }
        if (this.tryToSpawn(boardState, {x: x - dx * squareSize, y: y})) {
          break;
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

    var pctDone = boardState.getWavesSpawned() / this.getWavesToSpawn();
    var spawnWeights = [
      {weight: lerp(200, 100, pctDone), value: UnitBasicSquare},
      {weight: lerp(200, 100, pctDone), value: UnitBasicDiamond},
      {weight: triangle(0, 100, 50, pctDone), value: UnitFast},
      {weight: lerp(0, 100, pctDone), value: UnitHeavy},
      {weight: triangle(0, 100, 50, pctDone), value: UnitShover},
      {weight: lerp(0, 50, pctDone), value: UnitShooter}
    ];
    var unitClass = this.getRandomFromWeightedList(boardState.getRandom(), spawnWeights);

    var newUnit = new unitClass(position.x, position.y - squareHeight * 2, 0);
    newUnit.setMoveTarget(position.x, position.y);
    boardState.addUnit(newUnit);
    return true;
  }

  getRandomFromWeightedList(randNum, weightedList) {
    var value = null;
    var totalWeight = 0;
    weightedList.forEach((weightedItem) => { totalWeight += weightedItem.weight; });
    if (totalWeight <= 0) { throw new Error("Invalid spawn weights"); }

    var r = Math.floor(randNum * totalWeight);
    for (var i = 0; i < weightedList.length; i++) {
      r -= weightedList[i].weight;
      value = weightedList[i].value;
      if (r < 0) {
        return value;
      }
    }
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