class UnitBasicSquare extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;
    var offset = 0;
    this.collisionBox = [
      Line(l - offset, t, r + offset, t), // Top
      Line(r, t - offset, r, b + offset), // Right
      Line(r + offset, b, l - offset, b), // Bottom
      Line(l, b + offset, l, t - offset), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_square_red'].texture
    );

    this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }
}

UnitBasicSquare.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBasicSquare.AddToTypeMap();
