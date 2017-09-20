// Deployables.  If an enemy walks into a turret, it destroys it.
// (1) Shoot a projectile.  All turrets shoot at the cursor this turn as well.
// (2) Place a turret.  Lasts X turns.  Every turn, it shoots a single bullet straight up.
// (3) Place a cannon turret.  Lasts X turns.  Every turn, it shoots
// (4) Landmines.  Shoot a projectile.  When it hits an enemy, (3?) landmines scatter in the 2x3 space below the target.
// (5) Place a bomb on the ground.  After X (3?) turns, it explodes into a bunch
//      of projectiles.  Enemies push the bomb down when they walk into it, and
//      it can damage players


function ClarenceDeck() {
  var abilities = [
    {
      name: 'Shield',
      description: 'Puts up a shield with [[duration]] health.<br>' +
        'It loses one health per turn, or when it defends.<br>' +
        'Whenever a unit tries to enter, relatiate for [[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]]',
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
    },
    {
      name: 'Turret',
      description: 'Create a turret.  It shoots every turn',
      card_text_description: '100 / t',
      ability_type: "CREATE_UNIT",
      duration: 6,
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: 0, left: 2, right: 1},
      icon: "../Bouncy/assets/icons/turret.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
