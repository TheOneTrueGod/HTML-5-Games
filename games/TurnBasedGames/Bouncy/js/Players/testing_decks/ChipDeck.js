function ChipDeck() {
  var abilities = [
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape:"TRI_SHOT",
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      num_bullets_per_side:2,
      hit_effects:[{"effect": ProjectileShape.HitEffects.DAMAGE,"base_damage":200}]
    },{
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      icon: "../Bouncy/assets/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 1000
      }],
    },{
      ability_type: "ZONE",
      unit_interaction: {
        prevent_unit_entry:true,
        unit_enter:[{
          effect: "ABILITY",
          ability_source: "BELOW_UNIT",
          abil_def: {
            "ability_type": AbilityDef.AbilityTypes.PROJECTILE,
            "shape": ProjectileAbilityDef.Shapes.SINGLE_SHOT,
            "projectile_type":"PENETRATE",
            "hit_effects":[{"effect": ProjectileShape.HitEffects.DAMAGE,"base_damage":400}]
          }
        }]
      },
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      duration: 5,
      zone_size: {"left":1,"right":1,"top":0,"bottom":0,"y_range": 0},
      unit_enter_effect: {},
      icon: "../Bouncy/assets/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    },{
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects: [{"effect": ProjectileShape.HitEffects.FREEZE,"duration":3}],
      icon:"../Bouncy/assets/icon_plain_frost.png",
      charge: {"initial_charge":-1,"max_charge":2,"charge_type":"TURNS"}
    },{
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects:[{"effect": ProjectileShape.HitEffects.DAMAGE,"base_damage":"50%","aoe_type":"BOX","aoe_size":{"x":[-2,2],"y":[-2,0]}}],
      icon:"../Bouncy/assets/icon_plain_hearts.png"
    }
]
  ;
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
