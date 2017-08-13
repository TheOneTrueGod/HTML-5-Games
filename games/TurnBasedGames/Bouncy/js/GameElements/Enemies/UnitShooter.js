class UnitShooter extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;

    var t = 0;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    // Octagonal

    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(r, t - offset, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, t - offset, this), // Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }

  doUnitActions(boardState) {
    boardState.addProjectile(
      new EnemyProjectile(
        {x: this.x, y: this.y}, {x: this.x, y: this.y + 50},
        Math.PI / 2, this.unitHitCallback
      )
    );
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_shoot'].texture
    );

    //this.addPhysicsLines(sprite, 0x0000ff);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }
}

UnitShooter.AddToTypeMap();
