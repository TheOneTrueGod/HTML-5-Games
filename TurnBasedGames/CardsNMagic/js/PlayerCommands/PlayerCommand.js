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
        boardState.addUnit(new UnitBit(this.x, this.y, 0));
      }
    } else {
      if (tick % 20 == 5) {
        boardState.addUnit(new UnitBit(this.x, this.y, 1));
      }
    }
  }

  serialize() {
    var serialized = this.serializeChildData();
    serialized.command = this.constructor.name;
    serialized.x = this.x;
    serialized.y = this.y;
    serialized.playerID = this.playerID;
    return JSON.stringify(serialized);
  }

  setFromServerData(serverData) {
    this.abilityID = serverData.abilityID;
  }

  serializeChildData() {
    return {'abilityID': this.abilityID};
  }
}

PlayerCommand.FromServerData = function(serializedData) {
  var deserialized = JSON.parse(serializedData);

  CommandClass = PlayerCommand;
  if (deserialized.command) {
    if (!(deserialized.command in PlayerCommand.CommandTypeMap)) {
      alert(deserialized.command + " not in PlayerCommand.CommandTypeMap");
    } else {
      CommandClass = PlayerCommand.CommandTypeMap[deserialized.command];
    }
  }

  var pc = new CommandClass(
    deserialized.x,
    deserialized.y
  );
  pc.setPlayerID(deserialized.playerID);
  pc.setFromServerData(deserialized);
  return pc;
}

PlayerCommand.CommandTypeMap = {
};
PlayerCommand.AddToTypeMap = function() {
  PlayerCommand.CommandTypeMap[this.name] = this;
}