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
      //this.abilities = this.createTestAbilities();
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
        'shape': ProjectileAbilityDef.Shapes.SPRAY_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects':
          [{
            'effect': ProjectileShape.HitEffects.DAMAGE,
            'base_damage': 100
          }],
          'num_bullets': 12,
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.AOE_EFFECT,
        'hit_effects': [
          {
            'effect': ProjectileShape.HitEffects.DAMAGE,
            'base_damage': 150
          }
        ],
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.CHAIN_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 200
        }],
        'bullet_waves': 6
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.CHAIN_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 60
        }, {
          'effect': ProjectileShape.HitEffects.BULLET_SPLIT,
          'contact_effect': ProjectileShape.ContactEffects.HIT,
          'hit_effects': [{
            'effect': ProjectileShape.HitEffects.DAMAGE,
            'base_damage': 40
          }],
          'num_bullets': 4
        }],
        'bullet_waves': 5,
        'bullet_wave_delay': 5,
      }),
      AbilityDef.createFromJSON({
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.RAIN,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 20
        }],
        'num_bullets': 50
      })
    ];
  }
}
