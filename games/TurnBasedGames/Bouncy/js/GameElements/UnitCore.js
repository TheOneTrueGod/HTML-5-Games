class UnitCore extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['core'].texture
    );

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFFFF00);
    graphics.drawCircle(0, 0, 20);
    graphics.endFill();

    this.selectedSprite = graphics;
    this.selectedSprite.visible = false;

    sprite.addChild(graphics);
    sprite.anchor.set(0.5);

    return sprite;
  }

  canSelect() {
    return MainGame.playerID == this.owner;
  }

  getMoveSpeed() {
    return 4;
  }

  runTick(boardState) {
    if (this.moveTarget) {
      var moveVec = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
      var ang = Math.atan2(
        this.moveTarget.y - this.y,
        this.moveTarget.x - this.x
      );
      
      var moveSpeed = this.getMoveSpeed();
      
      if (moveVec.length() <= moveSpeed) {
        this.x = this.moveTarget.x;
        this.y = this.moveTarget.y;
        this.moveTarget = null;
      } else {
        this.x += Math.cos(ang) * moveSpeed;
        this.y += Math.sin(ang) * moveSpeed;
      }
    }
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitCore.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitCore.AddToTypeMap();
