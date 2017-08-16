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
        'projectile_type': ProjectileShape.ProjectileTypes.PENETRATE,
        "icon":"../Bouncy/assets/icon_plain_drill.png",
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 1000
        }],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'projectile_type': ProjectileShape.ProjectileTypes.TIMEOUT,
        'card_text': "12 X 80",
        "icon":"../Bouncy/assets/icon_plain_burst.png",
        'hit_effects': [],
        'timeout_effects': [
          {
            effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
            abil_def: {
              'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
              'shape': ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
              'projectile_type': ProjectileShape.ProjectileTypes.BOUNCE,
              'max_bounces': 2,
              'num_bullets': 12,
              'hit_effects':
                [{
                  'effect': ProjectileShape.HitEffects.DAMAGE,
                  'base_damage': 80
                }],
            }
          }
        ],
        "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
      },
      JSON.parse('{"ability_type":"PROJECTILE","shape":"RAIN","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":10}],"shots_per_tick":1,"num_bullets":100,"icon":"../Bouncy/assets/icon_plain_rain.png"}'),
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'projectile_type': ProjectileShape.ProjectileTypes.FROZEN_ORB,
        "icon":"../Bouncy/assets/icon_plain_forb.png",
        'hit_effects': [{
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 25
        }]
      }
    ];

    return [
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
        'projectile_type': ProjectileShape.ProjectileTypes.HIT,
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
        'projectile_type': ProjectileShape.ProjectileTypes.PENETRATE,
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
              'projectile_type': ProjectileShape.ProjectileTypes.PENETRATE,
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
        'projectile_type': ProjectileShape.ProjectileTypes.HIT,
        'hit_effects':
          [
            FreezeHitEffect.createJSON(3)
          ],
      },
      {
        'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
        'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
        'projectile_type': ProjectileShape.ProjectileTypes.HIT,
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
