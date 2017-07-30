class ProjectileTrailEffect extends Effect {
  constructor(projectile, duration) {
    super({x: projectile.x, y: projectile.y}, 0);
    this.startTime = duration;
    this.time = this.startTime;

    this.projectile = projectile;
  }

  createSprite() {
    return this.projectile.createSprite();
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
    this.gameSprite.scale.x = lerp(1, 0.5, (1 - this.time / this.startTime));
    this.gameSprite.scale.y = lerp(1, 0.5, (1 - this.time / this.startTime));
  }
}
