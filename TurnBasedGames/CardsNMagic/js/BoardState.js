class BoardState {
  constructor(serverData) {
    if (!serverData) {
      this.enemies = [[40, 40], [50, 60]];
      this.turn = 1;
    } else {
      serverData = JSON.parse(serverData);
      this.enemies = serverData.enemies;
      this.turn = serverData.turn;
      if (!this.turn) { this.turn = 1; }
    }
  }

  incrementTurn() {
    this.turn += 1;
  }

  serializeBoardState() {
    return JSON.stringify({
      'enemies': this.enemies,
      'turn': this.turn,
    });
  }
}
