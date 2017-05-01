class PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    this.playerID = $('#gameContainer').attr('playerID');
    this.abilityID = abilityID;
    this.x = x;
    this.y = y;
  }

  setPlayerID(playerID) {
    this.playerID = playerID;
  }

  getPlayerID() {
    return this.playerID;
  }

  doActionOnTick(tick, boardState) {
    if (this.abilityID == 1) {
      if (tick % 20 == 10) {
        boardState.addUnit(new Unit(this.x, this.y));
      }
    } else {
      if (tick % 20 == 5) {
        boardState.addUnit(new Unit(this.x, this.y));
      }
    }
  }

  serialize() {
    return JSON.stringify({
      'abilityID': this.abilityID,
      'x': this.x,
      'y': this.y,
      'playerID': this.playerID
    })
  }
}

PlayerCommand.FromServerData = function(serializedData) {
  var deserialized = JSON.parse(serializedData);
  var pc = new PlayerCommand(
    deserialized.x,
    deserialized.y,
    deserialized.abilityID
  );
  pc.setPlayerID(deserialized.playerID);
  return pc;
}
