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
      'contact_effect': ProjectileAbilityDef.ContactEffects.BOUNCE,
      'hit_effect': ProjectileAbilityDef.HitEffects.DAMAGE,
      'base_damage': 60
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
      'contact_effect': ProjectileAbilityDef.ContactEffects.BOUNCE,
      'hit_effect': ProjectileAbilityDef.HitEffects.DAMAGE,
      'base_damage': 40
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.TRI_SHOT,
      'contact_effect': ProjectileAbilityDef.ContactEffects.HIT,
      'hit_effect': ProjectileAbilityDef.HitEffects.DAMAGE,
      'base_damage': 100
    }),
    AbilityDef.createFromJSON({
      'ability_type': AbilityDef.AbilityTypes.PROJECTILE,
      'shape': ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      'contact_effect': ProjectileAbilityDef.ContactEffects.BOUNCE,
      'hit_effect': ProjectileAbilityDef.HitEffects.DAMAGE,
      'base_damage': 5,
      'bullet_waves': 20,
      'bullet_wave_delay': 5,
    })
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
