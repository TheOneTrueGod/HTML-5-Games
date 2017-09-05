// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// [done] Passthrough projectile.
// [done] AoE Explodes on contact.


function SeanDeck() {
  var abilities = [
    {
      name: 'Poison Drill',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.<br>' +
        'It also poisons them, dealing [[hit_effects[1].damage]] over [[hit_effects[1].duration]] turns',

      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PASSTHROUGH,
      num_hits: 8,
      icon: "../Bouncy/assets/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 50
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 50,
        duration: 2
      }],
      "charge":{"initial_charge":-1, "max_charge":4, "charge_type":"TURNS"}
    },
    {
      name: 'Infect',
      description: 'Shoots a projectile that hits a single enemy.<br>' +
        'That enemy is infected.  If they die in the next [[hit_effects[0].duration]] ' +
        'turns, they explode into [[hit_effects[0].abil_def.num_bullets]] bullets, ' +
        'each one dealing [[hit_effects[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[hit_effects[0].abil_def.num_bullets]] X [[hit_effects[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.INFECT,
        duration: 2,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          bullet_speed: 6,
          num_bullets: 20,
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: 100
          }],
        }
      }],
      icon: "../Bouncy/assets/icons/nuclear.png"
    },
    {
      name: 'Chaos Orb',
      description: 'Shoots an orb that rapidly decays.<br>' +
        'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage<br>',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      num_bullets: 50,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon:"../Bouncy/assets/icon_plain_forb.png",
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 45
        }
      ]
    },
    {
      name: 'Poison Explosion',
      description: 'Fires a single bullet, poisoning all enemies in a 3x3 area<br>' +
        'Deals [[hit_effects[0].damage]] over [[hit_effects[0].duration]] turns.',
      card_text_description: '[[hit_effects[0].damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects:[{damage: 100, duration: 3, effect:ProjectileShape.HitEffects.POISON, aoe_type:"BOX"}],
      icon: "../Bouncy/assets/icons/poison-gas.png"
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
