class PlayerCommandMoveUnit extends PlayerCommand {
  constructor(x, y, unitID) {
    super(x, y, null);
    this.unitID = unitID;
  }

  doActionOnTick(tick, boardState) {
    var unit = MainGame.boardState.findUnit(this.unitID);
    if (!unit) { alert("Couldn't find unit with id;" + this.unitID); }
    unit.x = this.x;
    unit.y = this.y;
  }

  setFromServerData(serverData) {
    this.unitID = serverData.unitID;
  }

  serializeChildData() {
    return {'unitID': this.unitID};
  }
}

PlayerCommandMoveUnit.AddToTypeMap();
