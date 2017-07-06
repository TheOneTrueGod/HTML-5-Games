class Projectile {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.gameSprite = null;
  }

  runTick() {
    this.x += Math.cos(this.angle) * 4;
    this.y += Math.sin(this.angle) * 4;

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    if (this.x <= 0 || this.x > 500 || this.y < 0 || this.y > 600) {
      //TODO: Delete me
    }
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
    sprite.anchor.set(0.5);
    return sprite;
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }
}
