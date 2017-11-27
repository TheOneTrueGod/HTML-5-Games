class LevelDefsWorld2 {
  static getStageDef(stage) {
    if (stage == 1) {
      // Hard level.  15 waves, 
      return new LevelDef({
        'waveCount': 2,
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [null, null, null],
            [null, UnitBossHealer, null],
            [null, null, null],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      })
    }
    console.warn("No level def for World 2, stage " + stage);
    return new LevelDef();
  }
}