class SpawnFormation {
  constructor(boardState, totalWaves) {
    this.boardState = boardState;
    this.totalWaves = totalWaves;
  }

  isValidSpawnSpot(spawnPosition) {
    return true;
  }

  spawn(spawnPosition) {

  }

  getBasicUnitSpawnWeights() {
    var wavesSpawned = this.boardState.getWavesSpawned();
    var pctDone = wavesSpawned / this.totalWaves;
    return [
      {weight: lerp(200, 100, pctDone), value: UnitBasicSquare},
      {weight: lerp(200, 100, pctDone), value: UnitBasicDiamond},
      {weight: triangle(0, 100, 50, pctDone), value: UnitFast},
      {weight: lerp(0, 100, pctDone), value: UnitShover},
      {weight: triangle(0, 0, 100, pctDone), value: UnitHeavy}
    ];
  }

  getSpawnDelay() {
    return 2;
  }
}

class BasicUnitWaveSpawnFormation extends SpawnFormation {
  constructor(boardState, totalWaves) {
    super(boardState, totalWaves);

    var pctDone = this.boardState.getWavesSpawned() / this.totalWaves;
    this.unitsToSpawn = this.boardState.sectors.columns
      - Math.floor((1 - pctDone) * 3) // 0-2
      - Math.floor(this.boardState.getRandom() * 3) // 0-2
      - 1
      ;
    this.validSpawnSpots = [];
    this.isValidSpawn = null;
  }

  isValidSpawnSpot(spawnPosition) {
    if (this.isValidSpawn !== null) { return this.isValidSpawn; }
    var y = 0;
    for (var x = 0; x < this.boardState.sectors.columns; x++) {
      var spot = Victor(x, y);
      if (this.boardState.sectors.canUnitEnter(
        this.boardState, null,
        this.boardState.sectors.getPositionFromGrid(spot)
      )) {
        this.validSpawnSpots.push(spot);
      }
    }
    this.isValidSpawn = this.validSpawnSpots.length >= this.unitsToSpawn;
    return this.isValidSpawn;
  }

  spawn(spawnPosition) {
    for (var i = 0; i < this.unitsToSpawn; i++) {
      var spawnPos = this.getRandomSpawnLocation();

      var spawnWeights = this.getBasicUnitSpawnWeights();
      var unitClass = getRandomFromWeightedList(this.boardState.getRandom(), spawnWeights);
      this.spawnUnitAtLocation(unitClass, spawnPos);
    }
  }

  getRandomSpawnLocation() {
    var spawnPosIndex = Math.floor(Math.random() * this.validSpawnSpots.length);
    var spawnGridPos = this.validSpawnSpots.splice(spawnPosIndex, 1)[0];
    var spawnPos = this.boardState.sectors.getPositionFromGrid(
      spawnGridPos
    );

    return spawnPos;
  }

  spawnUnitAtLocation(unitClass, spawnPos) {
    var newUnit = new unitClass(spawnPos.x, spawnPos.y - Unit.UNIT_SIZE, 0);
    newUnit.setMoveTarget(spawnPos.x, spawnPos.y);
    this.boardState.addUnit(newUnit);
  }

  getSpawnDelay() {
    return 1;
  }
}

class AdvancedUnitWaveSpawnFormation extends BasicUnitWaveSpawnFormation {
  getAdvancedUnitSpawnWeights() {
    return [
      {weight: 1, value: UnitShooter},
      {weight: 1, value: UnitBomber},
      {weight: 1, value: UnitKnight},
      {weight: 1, value: UnitProtector}
    ];
  }

  calculateNumSpecialsToSpawn(unitClass) {
    var wavesSpawned = this.boardState.getWavesSpawned();
    var pctDone = wavesSpawned / this.totalWaves;

    switch (unitClass) {
      case UnitShooter:
        Math.floor(pctDone * 3) + 1;
        break;
      default:
        return Math.floor(pctDone) + 1;
    }
  }

  spawn(spawnPosition) {
    var spawnWeights = this.getAdvancedUnitSpawnWeights();
    var unitClass = getRandomFromWeightedList(this.boardState.getRandom(), spawnWeights);

    const ADVANCED_UNITS_TO_SPAWN = this.calculateNumSpecialsToSpawn();
    this.unitsToSpawn -= ADVANCED_UNITS_TO_SPAWN;
    super.spawn(spawnPosition);
    this.unitsToSpawn += ADVANCED_UNITS_TO_SPAWN;

    for (var i = 0; i < ADVANCED_UNITS_TO_SPAWN; i++) {
      var spawnPos = this.getRandomSpawnLocation();

      this.spawnUnitAtLocation(unitClass, spawnPos);
    }
  }
}
