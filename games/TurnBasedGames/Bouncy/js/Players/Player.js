function Player(playerData, index) {
  if (!(this instanceof Player)) {
    return new Player(playerData, index);
  }
  this.player_index = index;

  this.user_name = playerData.user_name;
  this.user_id = playerData.user_id;

  if (playerData.ability_deck) {
    this.abilityDeck = new PlayerDeck(playerData.ability_deck);
  }
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
  return this.abilityDeck.getAbilities();
}

Player.prototype.getAbility = function(index) {
  return this.abilityDeck.getAbility(index);
}

Player.prototype.getAbilityDeckName = function() {
  return this.abilityDeck ? this.abilityDeck.getName() : "No Selected Deck";
}

Player.prototype.getAbilityDeckID = function() {
  return this.abilityDeck ? this.abilityDeck.getID() : undefined;
}
