class PlayerDeck {
  constructor(deckData) {
    this.name = "Unnamed";
    this.id = undefined;
    if (deckData) {
      this.name = deckData.name;
      this.id = deckData.id;
      var serializedDeck = JSON.parse(deckData.deckJSON);
      this.abilities = [];
      for (var i = 0; i < serializedDeck.length; i++) {
        this.abilities.push(AbilityDef.createFromJSON(serializedDeck[i]));
      }
    }
  }

  getAbilities() {
    return this.abilities;
  }

  getAbility(index) {
    if (0 <= index < this.abilities.length) {
      return this.abilities[index];
    }
    throw new Error("[" + index + "] doesn't exist in this abilities");
  }

  getName() {
    return this.name;
  }

  getID() {
    return this.id;
  }

  // TODO: DELETE ME
  createTestAbilities() {
    return [
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.PENETRATE,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
        'base_damage': 300
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.PASSTHROUGH,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
        'num_hits': 5,
        'base_damage': 40
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
        'base_damage': 100
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.CHAIN_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.BOUNCE,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
        'base_damage': 4,
        'bullet_waves': 20,
        'bullet_wave_delay': 5,
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.AOE_EFFECT,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE, ProjectileShape.HitEffects.FREEZE],
        'freeze': {
          'duration': 2,
        },
        'base_damage': 40,
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.AOE_EFFECT,
        'hit_effects': [ProjectileShape.HitEffects.DAMAGE, ProjectileShape.HitEffects.POISON],
        'base_damage': 30,
        'poison': {
          'damage': 10,
          'duration': 2,
          'effect': 1.5
        }
      }),
    ];
  }
}
