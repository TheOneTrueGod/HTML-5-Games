class LevelDefs {
  getLevelDef(level) {
    let world = this.extractWorld(level);
    let stage = this.extractStage(level);
    
    if (world == 1) {
      if (stage == 1) {
        return new LevelDef({
          'waves':[
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitShover, 'count': 6}, {'unit': UnitBasicSquare, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
            {'type': LevelDef.WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitShover, 'count': 10}]},
          ]
        })
      }
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
    return world <= 1 && stage !== 'boss';
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
      case LevelDef.WAVE_TYPE:
        return new UnitListSpawnFormation(boardState, wave.units);
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

LevelDef.WAVE_TYPES = {
  UNIT_LIST: 'unit_list',
}

LevelDefs = new LevelDefs();