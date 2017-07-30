class EffectFactory {

}

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
