class UnitShover extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    this.movementCredits = 0;
    this.movementSpeed = 2;
    this.health = {current: 150, max: 150};
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;
    // Octagonal

    this.collisionBox = [
      new UnitLine(s / 2, -s, -s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, s, this), // Right
      new UnitLine(s, s, -s, s, this), // Bottom
      new UnitLine(-s, s, -s / 2, -s, this), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_square_red'].texture
    );

    this.addPhysicsLines(sprite, 0x00ff00);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }
}

UnitShover.AddToTypeMap();
