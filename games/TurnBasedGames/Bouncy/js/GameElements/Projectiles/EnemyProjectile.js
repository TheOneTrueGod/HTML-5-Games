class EnemyProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, projectileOptions) {
    super(startPoint, targetPoint, angle, projectileOptions);
    this.FRIENDLY_FIRE = idx(projectileOptions, 'friendly_fire', false);
  }

  shouldBounceOffLine(line) {
    if (line.unit instanceof UnitBasic) {
      return false;
    }
    return true;
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    if (this.y > boardState.getUnitThreshold()) {
      this.delete();
      boardState.dealDamage(1);
      EffectFactory.createDamagePlayersEffect(
        boardState,
        this.x,
        this.y
      );
    }
  }

  hitUnit(boardState, unit, intersection) {
    if (unit instanceof UnitBasic && !this.FRIENDLY_FIRE) {
      return;
    }
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    this.readyToDel = true;
    if (intersection.line && !unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }
}
