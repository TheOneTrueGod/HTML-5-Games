class EnemyProjectile extends Projectile {
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
    if (unit instanceof UnitBasic) {
      return;
    }
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    if (intersection.line && !unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }
}
