class Interceptor extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.interceptor, 0),
      null,
      Textures.getTextureFrame(Textures.interceptor, 1)
    );

    this.size = 8;
    this.maxHealth = 50;
    this.health = this.maxHealth;

    this.armorType = Ship.ARMORTYPE.LIGHT;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    //ExplosionEffect.createExplosion(this.position, this.angle);
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.interceptor, 1),
      duration ? duration : 20
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Container();
    var weapon = sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 2)));
    //weapon.anchor.x = 0.5;
    //weapon.anchor.y = 0.5;
    var flipWeapon = sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 2)));
    flipWeapon.scale.x = -1;
    flipWeapon.position.x = 0;
    flipWeapon.position.y = 0;
    //flipWeapon.anchor.x = 0.5;
    //flipWeapon.anchor.y = 0.5;

    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 0)));
    return sprite;
  }
}
