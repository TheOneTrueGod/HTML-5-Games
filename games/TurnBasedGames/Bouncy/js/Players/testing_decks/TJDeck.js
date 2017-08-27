function TJDeck() {
  var abilities = [
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      destroy_on_wall: true,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 100, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: 12
    },
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects:[{base_damage: 200, effect:ProjectileShape.HitEffects.DAMAGE, aoe_type:"BOX"}],
      icon: "../Bouncy/assets/icon_plain_explosion.png"
    },
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 100, effect: ProjectileShape.HitEffects.DAMAGE}],
      bullet_waves: 14
    },
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 25},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 10,
          }],
          num_bullets: 2
        }
      ],
      num_bullets: 40,
      icon: "../Bouncy/assets/icon_plain_rain.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
    },{
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects:[
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 60,
          aoe_type: ProjectileShape.AOE_TYPES.BOX,
          aoe_size:{x: [-1, 1], y:[-1, 0]},
        },
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 40,
            aoe_type: ProjectileShape.AOE_TYPES.BOX,
            aoe_size:{x: [-1, 1], y:[-1, 0]},
          }],
          num_bullets: 6
        }
       ],
       icon: "../Bouncy/assets/icon_plain_splurt.png",
       charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"}
    }
  ];
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
