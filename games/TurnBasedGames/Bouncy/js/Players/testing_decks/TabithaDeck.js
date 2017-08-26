function TabithaDeck() {
  var abilities = [
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
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 45}],
      num_bullets: 40,
      icon: "../Bouncy/assets/icon_plain_rain.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"}
    },
    {
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'projectile_type': ProjectileShape.ProjectileTypes.FROZEN_ORB,
      "icon":"../Bouncy/assets/icon_plain_forb.png",
      'hit_effects': [
        {
          'effect': ProjectileShape.HitEffects.DAMAGE,
          'base_damage': 20
        },
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 5,
          }],
          num_bullets: 3
        }
      ]
    },
    {
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.WAVE,
      'projectile_type': ProjectileShape.ProjectileTypes.BOUNCE,
      'max_bounces': 2,
      "icon":"../Bouncy/assets/icon_plain_wave.png",
      'hit_effects': [{
        'effect': ProjectileShape.HitEffects.DAMAGE,
        'base_damage': 40
      }]
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
