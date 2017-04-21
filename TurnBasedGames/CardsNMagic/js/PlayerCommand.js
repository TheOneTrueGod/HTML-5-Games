class PlayerCommand {
  constructor(
    x, y
  ) {
    this.playerID = $('#gameContainer').attr('playerID');
  }

  getPlayerID() {
    return this.playerID;
  }
}
