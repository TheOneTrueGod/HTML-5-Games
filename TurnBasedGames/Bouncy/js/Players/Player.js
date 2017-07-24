function Player(playerData, index) {
  if (!(this instanceof Player)) {
    return new Player(playerData, index);
  }
  this.player_index = index;

  this.user_name = playerData.user_name;
  this.user_id = playerData.user_id;

  this.abilities = [
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.PENETRATE,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
      'base_damage': 300
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.PASSTHROUGH,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
      'num_hits': 5,
      'base_damage': 40
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.HIT,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
      'base_damage': 100
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.BOUNCE,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
      'base_damage': 4,
      'bullet_waves': 20,
      'bullet_wave_delay': 5,
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.AOE_EFFECT,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE],
      'base_damage': 80,
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      'contact_effect': ProjectileShape.ContactEffects.AOE_EFFECT,
      'hit_effects': [ProjectileShape.HitEffects.DAMAGE, ProjectileShape.HitEffects.POISON],
      'base_damage': 30,
      'poison': {
        'damage': 10,
        'duration': 2,
        'effect': 1.5
      }
    }),
  ];
}

Player.prototype.getUserName = function() {
  return this.user_name;
};

Player.prototype.getUserID = function() {
  return this.user_id;
};

Player.prototype.getIndex = function() {
  return this.player_index;
};

Player.prototype.getAbilities = function() {
  return this.abilities;
}

Player.prototype.getAbility = function(index) {

}
