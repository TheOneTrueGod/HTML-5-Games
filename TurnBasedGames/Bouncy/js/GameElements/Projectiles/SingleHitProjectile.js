class SingleHitProjectile extends Projectile {
  hitUnit(boardState, unit, intersection) {
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

    this.readyToDel = true;
  }
}
