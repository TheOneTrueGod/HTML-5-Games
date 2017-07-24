class StatusEffect {
  constructor(duration) {
    this.duration = duration;
  }

  getEffectType() {
    return this.constructor.name;
  }

  readyToDelete() {
    return this.duration <= 0;
  }

  turnStart(unit) {
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return 1;
  }

  turnEnd(unit) {

  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'duration': this.duration
    };
  }
}

StatusEffect.fromServerData = function(serverData) {
  if (serverData.effect_type) {
    var EffectClass = null;
    if (!(serverData.effect_type in StatusEffect.StatusEffectTypeMap)) {
      alert(serverData.effect_type + " not in Unit.StatusEffectTypeMap.");
    } else {
      EffectClass = StatusEffect.StatusEffectTypeMap[serverData.effect_type];
    }
    if (EffectClass) {
      return EffectClass.loadFromServerData(serverData);
    }
  }
  throw new Error("No effect type when creating status effect.  No idea what to do.");
}

StatusEffect.StatusEffectTypeMap = {
};
StatusEffect.AddToTypeMap = function() {
  StatusEffect.StatusEffectTypeMap[this.name] = this;
}