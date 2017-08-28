function TJDeck() {
  var abilities = [
    {
      name: 'Shotgun',
      description: 'Shoots a spray of [[num_bullets]] bullets, dealing [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      destroy_on_wall: true,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 100, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: 12
    },
    {
      name: 'Explosion',
      description: 'Shoots a single bullet, dealing [[hit_effects[0].base_damage]] in a 3x3 area',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects:[{base_damage: 200, effect:ProjectileShape.HitEffects.DAMAGE, aoe_type:"BOX"}],
      icon: "../Bouncy/assets/icon_plain_explosion.png"
    },
    {
      name: 'Spread Shot',
      description: 'Shoots 7 bullets, each dealing [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape:"TRI_SHOT",
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      num_bullets_per_side: 3,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage:150}]
    },
    {
      name: 'Rain',
      description: 'Make it rain.  Fires [[num_bullets]] projectiles.  ' +
        'Each one deals 25 damage, and then splits into [[hit_effects[1].num_bullets]] projectiles that deal [[hit_effects[1].hit_effects[0].base_damage]].  ' +
        'Can\'t be aimed.',
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
      name: 'Splurt',
      description: 'Deals [[hit_effects[0].base_damage]] AoE damage.  ' +
      'Then splits into [[hit_effects[1].num_bullets]] bullets that each deal [[hit_effects[1].hit_effects[0].base_damage]].',
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
