class AoEHitProjectile extends Projectile {
  constructor(startPoint, angle, unitHitCallback, radius, projectileOptions) {
    super(startPoint, angle, unitHitCallback, projectileOptions);
    this.radius = radius;
  }

  hitUnit(boardState, unit, intersection) {
    var totalUnits = {};
    for (var x = -1; x <= 1; x++) {
      for (var y = -1; y <= 1; y++) {
        var unitsAtPosition = boardState.sectors.getUnitsAtPosition(
          unit.getX() + x * this.radius,
          unit.getY() + y * this.radius
        );
        for (var targetUnit in unitsAtPosition) {
          if (!(unitsAtPosition[targetUnit] in totalUnits)) {
            totalUnits[unitsAtPosition[targetUnit]]
              = boardState.findUnit(unitsAtPosition[targetUnit]);
          }
        }
      }
    }

    for (var id in totalUnits) {
      var targetUnit = totalUnits[id];
      var dist = Math.max(
        Math.abs(unit.x - targetUnit.x),
        Math.abs(unit.y - targetUnit.y)
      );
      EffectFactory.createDamageEntireUnitEffect(boardState, targetUnit);
      EffectFactory.createExplosionEffect(boardState, targetUnit);

      this.unitHitCallback(
        boardState,
        targetUnit,
        null,
        this
      );
    }

    this.readyToDel = true;
  }
}
