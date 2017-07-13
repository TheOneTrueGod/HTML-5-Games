class UnitBasicSquare extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;
    this.collisionBox = [
      Line(l, t, r, t), // Top
      Line(r, t, r, b), // Right
      Line(r, b, l, b), // Bottom
      Line(l, b, l, t), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_square_red'].texture
    );

    sprite.anchor.set(0.5);
    return sprite;
  }
}

UnitBasicSquare.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBasicSquare.AddToTypeMap();
