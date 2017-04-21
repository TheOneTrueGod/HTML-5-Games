class ExplosionEffect extends Effect {
  constructor(x, y, angle, time, endRadius, startAlpha) {
    super();
    var radius = 4;
    this.startPosition = new PIXI.Point(x, y);
    this.position.x = x;
    this.position.y = y;

    this.totalTime = time;
    this.time = this.totalTime;
    this.startAlpha = startAlpha ? startAlpha : 0.2;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();

    graphics.beginFill(0x00AA00);
    graphics.drawCircle(0, 0, radius / 2);
    graphics.endFill();

    graphics.beginFill(0x00AA00);
    graphics.moveTo(0, 0);
    graphics.lineTo(100, 100);
    graphics.endFill();

    var bodySprite = this.addChild(graphics);

    this.endRadius = endRadius;
    this.angle = angle + Math.PI / 2;
    this.rotation = this.angle;
  }

  readyToDelete() {
    return this.time <= 0;
  }

  static createExplosion(position, angle, radius) {
    var totalParticles = 10;
    for (var i = 0; i < totalParticles; i++) {
      Game.addEffect(new ExplosionEffect(
        position.x,
        position.y,
        angle + Math.PI * 2 * i / totalParticles,
        10,
        radius + Math.random() * radius * 0.2,
        0.5
      ));
    }
  }

  animationFrame(timescale) {
    this.time -= timescale;

    var pct = this.startAlpha * this.time / this.totalTime;
    this.alpha = Math.min(Math.max(pct, 0), this.startAlpha);

    var radiusPct = Math.min(Math.max((1 - this.time / this.totalTime) / 0.5, 0), 1);
    this.position.x = this.startPosition.x + Math.cos(this.angle) * radiusPct * this.endRadius;
    this.position.y = this.startPosition.y + Math.sin(this.angle) * radiusPct * this.endRadius;
  }
}
