class GrenadeProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef) {
    super(startPoint, targetPoint, angle, abilityDef, {});
    this.hitEnemy = false;
    this.ghost_time = abilityDef.getOptionalParam('duration', 10);
    this.start_ghost_time = this.ghost_time;

    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.maxDuration = Math.max(targetVec.length(), 100) / this.speed;
    this.duration = this.maxDuration;
  }

  shouldBounceOffLine(line) {
    return false;
  }

  createTrail(boardState) {
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    let z = Math.sin(this.duration / this.maxDuration * Math.PI) * 200;
    this.gameSprite.y = this.y - z;
  }
}
