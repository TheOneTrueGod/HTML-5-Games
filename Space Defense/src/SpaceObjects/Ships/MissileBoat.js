class MissileBoat extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.missile_boat, 0),
      Textures.getTextureFrame(Textures.missile_boat, 1),
      Textures.getTextureFrame(Textures.missile_boat, 2)
    );

    this.size = 15;
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.turnRadius = 0.01;
    this.weaponArc = Math.PI / 32;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.missile_boat, 2),
      duration ? duration : 50
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 0));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 1)));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 3)));
    return sprite;
  }
}
