class LightWeaponPlatform extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.light_weapon_platform, 0),
      Textures.getTextureFrame(Textures.light_weapon_platform, 1),
      Textures.getTextureFrame(Textures.light_weapon_platform, 2)
    );

    this.size = 15;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.turnRadius = 0.01;
    this.weaponArc = Math.PI / 32;

    this.armorType = Ship.ARMORTYPE.HEAVY;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.light_weapon_platform, 2),
      duration ? duration : 50
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 0));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 1)));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 3)));
    return sprite;
  }
}
