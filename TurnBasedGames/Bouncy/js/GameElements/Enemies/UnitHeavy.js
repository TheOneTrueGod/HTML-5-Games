class UnitHeavy extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    this.movementCredits = 0;
    this.movementSpeed = 0.5;
    this.health = {current: 200, max: 200};
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;
    // Octagonal
    this.collisionBox = [
      new UnitLine(-s, s / 2, -s, -s / 2, this), // Left
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL

      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2), // TR

      new UnitLine(s, -s / 2, s, s / 2, this), // Right
      new UnitLine(s, s / 2, s / 2, s, this), // BR

      new UnitLine(s / 2, s, -s / 2, s, this), // Bottom
      new UnitLine(-s / 2, s, -s, s / 2, this) // BL
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_square_red'].texture
    );

    this.addPhysicsLines(sprite, 0xff00ff);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }
}

UnitHeavy.AddToTypeMap();
