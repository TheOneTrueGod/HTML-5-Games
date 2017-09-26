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
      name: 'Gun Turret',
      description: 'Create a turret.<br>' +
        'It shoots every turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / turn',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration: 6,
      turret_image: 3,
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200}],
          charge: {initial_charge: -1, max_charge: 1, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "../Bouncy/assets/icons/turret.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Cannon Turret',
      description: 'Create a cannon turret.<br>' +
        'It shoots every other turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a small area.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / 2 turn',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration: 8,
      turret_image: 4,
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200, aoe_type:"BOX"}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "../Bouncy/assets/icons/cannon.png",
      charge: {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Focused Fire',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage.<br>It also makes all of your turrets aim where you are aiming.',
      card_text_description: '[[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      special_effects: [AbilityDef.SPECIAL_EFFECTS.TURRET_AIM],
      icon: "../Bouncy/assets/icons/targeting.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 400
      }],
    },
    {
      name: 'Landmines',
      description: 'Creates [[unit_count]] landmines<br>' +
        'If a unit steps on one, it explodes dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in an area<br>' +
        'They last for [[duration]] turns.<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      summon_area_type: SummonUnitAbilityDef.AREA_TYPES.LINE,
      unit_count: 5,
      duration: 5,
      unit: SummonUnitAbilityDef.UNITS.LANDMINE,
      sprite: {texture: 'deployables', index: 5},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.POSITION,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type:"BOX"}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 3, bottom: -1, left: 3, right: 3},
      icon: "../Bouncy/assets/icons/landmine.png",
      charge: {initial_charge: -1, max_charge: 5, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Rose of Death',
      description: 'Creates one giant bomb<br>' +
        'After [[duration]] turns, it explodes, dealing 500 damage in a small area, and 250 damage in a larger area.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration: 5,
      unit: SummonUnitAbilityDef.UNITS.PUSHABLE_EXPLOSIVE,
      sprite: {texture: 'deployables', index: 6, end_index: 10},
      unit_abilities: [{
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.POSITION,
            projectile_type: "HIT",
            speed: 8,
            hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 250, aoe_type:"BOX", aoe_size: {x: [-1, 1], y: [-2, 2]}}],
            charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
          }
        }, {
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.POSITION,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 250, aoe_type:"BOX", aoe_size: {x: [-2, 2], y: [-1, 1]}}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 1, right: 1},
      icon: "../Bouncy/assets/icons/landmine.png",
      charge: {initial_charge: -1, max_charge: 0, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
