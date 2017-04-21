class MovementEffect extends Effect {
  constructor(x, y, angle, texture, time, startAlpha) {
    super();
    this.position.x = x;
    this.position.y = y;

    this.totalTime = time;
    this.time = this.totalTime;
    this.startAlpha = startAlpha ? startAlpha : 0.2;

    var bodySprite = this.addChild(new PIXI.Sprite(texture));

    bodySprite.anchor.x = 0.5;
    bodySprite.anchor.y = 0.5;
    this.rotation = angle + Math.PI / 2;
  }

  readyToDelete() {
    return this.time <= 0;
  }

  animationFrame(timescale) {
    this.time -= timescale;

    var pct = this.startAlpha * this.time / this.totalTime;

    this.alpha = Math.min(Math.max(pct, 0), this.startAlpha);
  }
}
