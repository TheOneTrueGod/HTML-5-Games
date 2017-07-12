class Effect extends Projectile {
  constructor(x, y) {
    super(x, y, 0);
    this.startTime = 20;
    this.time = this.startTime;
  }

  createSprite() {
    throw new Error("Don't create effects directly");
    return sprite;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
  }

  readyToDelete() {
    return this.readyToDel || this.time <= 0;
  }
}
