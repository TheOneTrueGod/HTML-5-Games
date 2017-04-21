class FleetPreview extends PIXI.Container {
  constructor(x, y, width, height) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.width = width;
    this.height = height;

    this.gridWidth = 10;
    this.gridHeight = 10;

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.beginFill(0xCCCCCC);
    graphics.fillAlpha = 0.5;
    graphics.drawRect(0, 0, width, height);
    this.addChildAt(graphics, 0);

    this.gridSlots = [];

    this.shipDefs = [];
  }

  packageShipDefs() {
    return this.shipDefs;
  }

  clear() {
    var toRemove = [];
    for (var i = this.children.length - 1; i >= 1; i--) {
      this.removeChild(this.children[i]);
    }

    this.shipDefs = [];

    this.gridSlots = [];
    for (var x = 1; x < this.gridWidth; x++) {
      for (var y = 1; y < this.gridHeight; y++) {
        this.gridSlots.push({x, y});
      }
    }
  }

  removeShip(shipDef) {
    this.gridSlots.push(shipDef.data.gridPos);
    this.removeChild(shipDef.data.shipSprite);
    this.shipDefs.splice(this.shipDefs.indexOf(shipDef), 1);
  }

  addShip(shipDef, clickCallback) {
    if (this.gridSlots.length <= 0) {
      return false;
    }

    var slotWidth = this.width / this.gridWidth;
    var slotHeight = this.height / this.gridHeight;

    var shipSprite = shipDef.getSprite();

    var gridSlot = Math.floor(Math.random() * this.gridSlots.length);
    var gridPos = this.gridSlots[gridSlot];
    this.gridSlots.splice(gridSlot, 1);

    // TODO: Offset by 0.5 * slotWidth when you have a full ship here.
    shipSprite.position.x = Math.floor(gridPos.x * slotWidth);
    shipSprite.position.y = Math.floor(gridPos.y * slotHeight);

    //shipSprite.anchor.x = 0.5;
    //shipSprite.anchor.y = 0.5;

    var shipDefCopy = shipDef.copy();
    shipDefCopy.setData({gridPos, shipSprite})
    this.shipDefs.push(shipDefCopy);

    shipSprite.interactive = true;
    shipSprite.on('mousedown', this.createShipOnClick(shipDefCopy, clickCallback));
    shipSprite.on('touchstart', this.createShipOnClick(shipDefCopy, clickCallback));

    return this.addChild(shipSprite);
  }

  createShipOnClick(shipDef, clickCallback) {
    return () => {
      if (clickCallback) {
        clickCallback(shipDef);
      }
    }
  }
}
