class Unit {
  constructor(x, y, owner, id) {
    this.x = x;
    this.y = y;
    this.gameSprite = null;
    this.owner = owner;
    if (!id) {
      this.id = MainGame.boardState.getUnitID();
    } else {
      this.id = id;
    }
    this.selectedSprite = null;
    this.moveTarget = null;

    // See Also Unit.UNIT_SIZE
    this.physicsWidth = 50;
    this.physicsHeight = 50;
    this.collisionBox = [];
    this.health = {current: 2, max: 2};
    this.readyToDel = false;

    this.damage = 1;
  }

  setHealth(amount) {
    this.health.current = amount;
    if (this.health.current <= 0) {
      this.readyToDel = true;
    }
  }

  dealDamage(amount) {
    this.health.current -= Math.max(amount, 0);
    if (this.health.current <= 0) {
      this.readyToDel = true;
    }
  }

  readyToDelete() {
    return this.readyToDel;
  }

  getCollisionBox() {
    if (this.readyToDelete()) { return []; }
    if (this.memoizedCollisionBox) {
      return this.memoizedCollisionBox;
    }
    var self = this;
    this.memoizedCollisionBox = this.collisionBox.map((line) => {
      var returnLine = line.clone().addX(this.x).addY(this.y);
      returnLine.unit = this;
      return returnLine;
    });

    return this.memoizedCollisionBox;
  }

  isFinishedDoingAction() {
    return this.moveTarget === null;
  }

  setMoveTarget(x, y) {
    this.memoizedCollisionBox = null;
    this.moveTarget = {'x': x, 'y': y};
  }

  canSelect() {
    return false;
  }

  setSelected(selected) {
    if (this.selectedSprite) {
      this.selectedSprite.visible = selected;
    }
  }

  serialize() {
    var serialized = {
      'x': this.x,
      'y': this.y,
      'health': this.health.current,
      'moveTarget': null,
      'unitType': this.constructor.name,
      'owner': this.owner,
      'id': this.id,
    };
    if (this.moveTarget) {
      serialized.moveTarget = {
        'x': this.moveTarget.x,
        'y': this.moveTarget.y,
      };
    }

    return serialized;
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
    sprite.anchor.set(0.5);
    return sprite;
  }

  getTopLeft() {
    return {x: this.x - this.physicsWidth / 2, y: this.y - this.physicsWidth / 2};
  }

  getBottomRight() {
    return {x: this.x + this.physicsWidth / 2, y: this.y + this.physicsWidth / 2};
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }

  removeFromStage(stage) {
    stage.removeChild(this.gameSprite);
  }

  doMovement(boardState) {
  }

  runTick(boardState) {
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  getSelectionRadius() { return 20; }
}

Unit.loadFromServerData = function(serverData) {
  var x = 0;
  var y = 0;
  var owner = 0;
  var UnitClass = Unit;
  var id = null;
  if (serverData.x) { x = serverData.x; }
  if (serverData.y) { y = serverData.y; }
  if (serverData.owner) { owner = serverData.owner; }
  if (serverData.unitType) {
    if (!(serverData.unitType in Unit.UnitTypeMap)) {
      alert(serverData.unitType + " not in Unit.UnitTypeMap.");
    } else {
      UnitClass = Unit.UnitTypeMap[serverData.unitType];
    }
  }
  if (serverData.id) { id = serverData.id; }
  var unit = new UnitClass(x, y, owner, id);
  if (serverData.health) { unit.setHealth(serverData.health); }
  if (serverData.moveTarget) {
    unit.setMoveTarget(serverData.moveTarget.x, serverData.moveTarget.y);
  }
  return unit;
}

Unit.UNIT_SIZE = 50;
Unit.UnitTypeMap = {
};
Unit.AddToTypeMap = function() {
  Unit.UnitTypeMap[this.name] = this;
}
