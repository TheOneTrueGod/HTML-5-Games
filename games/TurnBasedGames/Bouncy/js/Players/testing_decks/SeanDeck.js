function SeanDeck() {
  var abilities = [
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

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
