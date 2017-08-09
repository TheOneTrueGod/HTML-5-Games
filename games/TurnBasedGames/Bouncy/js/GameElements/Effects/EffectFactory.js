class EffectFactory {}

EffectFactory.createDamagePlayersEffect = function(x, y, boardState) {
  for (var i = -2; i <= 2; i++) {
    var angle = -Math.PI / 2.0 + Math.PI / 8.0 * i;
    boardState.addProjectile(
      new LineEffect(new Line(
        x + Math.cos(angle) * 10,
        y + Math.sin(angle) * 10,
        x + Math.cos(angle) * 25,
        y + Math.sin(angle) * 25
      ),
      0xFF0000,
      {x: Math.cos(angle), y: Math.sin(angle)}
      )
    );
  }
}

EffectFactory.createDamageEntireUnitEffect = function(boardState, targetUnit) {
  var collisionBox = targetUnit.getCollisionBox();
  for (var i = 0; i < collisionBox.length; i++) {
    boardState.addProjectile(new LineEffect(collisionBox[i]));
  }
}

EffectFactory.createDamageEffect = function(boardState, intersection) {
  if (intersection.line) {
    var bullets = 4;
    for (var i = 0; i < bullets; i++) {
      var centerPoint = intersection.line.getCenterPoint();
      var angle = Math.PI / 4 * (i - (bullets / 2 - 0.5)) / (bullets / 2 - 0.5);
      var normal = intersection.line.getNormal();
      //console.log(normal);
      boardState.addProjectile(new CircleEffect(
        centerPoint, 1, 0xffffff, normal.multiplyScalar(2).addAngle(angle)
      ));
    }

    boardState.addProjectile(
      new LineEffect(intersection.line)
    );

  }
}

EffectFactory.createExplosionEffect = function(boardState, unit) {

}
