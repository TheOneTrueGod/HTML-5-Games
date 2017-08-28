class FrozenOrbProjectile extends BouncingProjectile {
  constructor(startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.duration = idx(projectileOptions, 'duration', 200);
    this.startDuration = this.duration;
    this.speedDecay = idx(projectileOptions, 'speed_decay', {x: 0.97, y: 0.97});
    this.speedDecayDelay = idx(this.speedDecay, 'delay', 80);
    this.size = idx(projectileOptions, 'size', 10);
    this.abilityDef = abilityDef;
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    var shotGap = 3;
    if (
      (boardState.tick - this.startTick) > 20 &&
      (boardState.tick - this.startTick) % shotGap == 0
    ) {
      var angle = (boardState.tick / shotGap) / (this.startDuration / shotGap)
        * Math.PI * 2 * 7
      var target = {x: this.x + Math.cos(angle), y: this.y + Math.sin(angle)};

      boardState.addProjectile(
        Projectile.createProjectile(
          ProjectileShape.ProjectileTypes.HIT,
          {x: this.x, y: this.y},
          target,
          angle,
          this.abilityDef,
          {}
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    }
  }

  hitUnit(boardState, unit, intersection) {
    this.wallsHit = 0;
    if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }
}
