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
      this.readyToDel = true;
      boardState.dealDamage(1);
      EffectFactory.createDamagePlayersEffect(
        this.x,
        this.y,
        boardState
      );
    }
  }

  hitUnit(boardState, unit, intersection) {
    if (unit instanceof UnitBasic) {
      return;
    }
    if (intersection.line) {
      boardState.addProjectile(
        new LineEffect(intersection.line)
      );
    }
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
  }
}
