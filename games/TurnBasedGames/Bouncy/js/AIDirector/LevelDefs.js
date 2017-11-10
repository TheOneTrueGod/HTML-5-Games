class LevelDefs {
  getLevelDef(level) {
    let world = this.extractWorld(level);
    let stage = this.extractStage(level);

    if (world == 1) {
      return LevelDefsWorld1.getStageDef(stage);
    }
    return new LevelDef();
  }

  extractWorld(level) {
    return level.split("-")[0];
  }

  extractStage(level) {
    return level.split("-")[1];
  }

  isLevelAvailable(level) {
    let world = this.extractWorld(level);
    let stage = this.extractStage(level);
    return world <= 1;
  }
}

class LevelDef {
  constructor(levelData) {
    if (!levelData) {
      this.totalWaves = 20;
      this.waves = null;
    } else {
      this.totalWaves = levelData.waves.length;
      this.waves = levelData.waves;
    }
  }

  getWaveSpawnFormation(boardState) {
    let wavesSpawned = boardState.getWavesSpawned();
    if (wavesSpawned >= this.waves.length) {
      return null;
    }
    let wave = this.waves[wavesSpawned];
    switch (wave.type) {
      case WAVE_TYPES.UNIT_LIST:
        return new UnitListSpawnFormation(boardState, wave.units);
      case WAVE_TYPES.BASIC_WAVE:
        return new BasicUnitWaveSpawnFormation(boardState, this.totalWaves, wave.count);
      case WAVE_TYPES.ADVANCED_WAVE:
        return new AdvancedUnitWaveSpawnFormation(boardState, this.totalWaves, wave.count, wave.advanced);
      case WAVE_TYPES.FORMATION:
        return new UnitFormationSpawnFormation(boardState, wave.units);
      case WAVE_TYPES.SKIP:
        return null;
      default:
        throw new Error("wave type (" + wave.type + ") not handled");
    }
  }

  getSpawnFormation(boardState) {
    if (this.waves) {
      return this.getWaveSpawnFormation(boardState);
    }
    let wavesSpawned = boardState.getWavesSpawned();
    if (
      wavesSpawned / this.totalWaves == 0.5 ||
      wavesSpawned == this.totalWaves - 1
    ) {
      return new KnightAndShooterSpawnFormation(boardState, this.totalWaves);
    }
    if (wavesSpawned % 2 == 0) {
      return new AdvancedUnitWaveSpawnFormation(boardState, this.totalWaves);
    }
    return new BasicUnitWaveSpawnFormation(boardState, this.totalWaves);
  }

  getGameProgress(boardState) {
    return boardState.wavesSpawned / this.totalWaves;
  }
}

LevelDefs = new LevelDefs();

const WAVE_TYPES = {
  UNIT_LIST: 'unit_list',
  BASIC_WAVE: 'basic_wave',
  ADVANCED_WAVE: 'advanced_wave',
  FORMATION: 'formation',
  SKIP: 'skip',
};
