class Component extends PIXI.Sprite {
  constructor(ship, texture) {
    super(texture);
    this.cooldown = 0;
    this.cooldownTime = 10;
    this.ship = ship;
  }

  animationFrame(timescale) {
    this.cooldown = Math.max(this.cooldown - timescale, 0);
  }

  setTint(tint) {
    this.tint = tint;
  }

  doAI(timescale) {

  }

  get addBehind() {
    return true;
  }
}
