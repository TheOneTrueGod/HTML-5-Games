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

      if (this.id == 2) {
        this.abilities = this.createTestAbilities();
        for (var i = 0; i < this.abilities.length; i++) {
          this.abilities[i] = AbilityDef.createFromJSON(this.abilities[i]);
        }
      }
    }
  }

  getAbilities() {
    return this.abilities;
  }

  getAbility(index) {
    if (0 <= index && index < this.abilities.length) {
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
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.PENETRATE,
        "icon":"../Bouncy/assets/icon_plain_drill.png",
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 1000
        }],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.TIMEOUT,
        'hit_effects': [],
        'timeout_effects': [
          {
            effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
            abil_def: {
              'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
              'shape': ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
              'contact_effect': ProjectileShape.ContactEffects.BOUNCE,
              'max_bounces': 2,
              'num_bullets': 12,
              'hit_effects':
                [{
                  'effect': ProjectileShape.HitEffects.DAMAGE,
                  'base_damage': 100
                }],
            }
          }
        ]
      },
      JSON.parse('{"ability_type":"PROJECTILE","shape":"RAIN","contact_effect":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":10}],"shots_per_tick":1,"num_bullets":100,"icon":"../Bouncy/assets/icon_plain_rain.png"}'),
    ];

    return [
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'num_bullets_per_side': 2,
        'hit_effects':
          [{
            'effect': ProjectileShape.HitEffects.DAMAGE,
            'base_damage': 200
          }],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.PENETRATE,
        'hit_effects':
          [{
            'effect': ProjectileShape.HitEffects.DAMAGE,
            'base_damage': 1000
          }],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.ZONE,
        'unit_interaction': ZoneAbilityDef.createUnitInteractionJSON(
          true,
          [ZoneAbilityDef.createUnitEntryAbilityInteraction(
            {
              'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
              'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
              'contact_effect': ProjectileShape.ContactEffects.PENETRATE,
              'hit_effects':
                [{
                  'effect': ProjectileShape.HitEffects.DAMAGE,
                  'base_damage': 400
                }],
            },
            ZoneAbilityDef.AbilitySources.BELOW_UNIT
          )]
        ),
        'duration': 5,
        'zone_size': {'left': 1, 'right': 1, 'top': 0, 'bottom': 0, 'y_range': 0},
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects':
          [
            FreezeHitEffect.createJSON(3)
          ],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'contact_effect': ProjectileShape.ContactEffects.HIT,
        'hit_effects':
          [
          DamageHitEffect.createJSON("50%", {
            'aoe_type': ProjectileShape.AOE_TYPES.BOX,
            'aoe_size': {x: [-2, 2], y: [-2, 0]}
          })
          ],
      }
    ];
  }
}
