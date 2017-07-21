class LineEffect extends Effect {
  constructor(line) {
    super({x: line.x1, y: line.y1}, 0);
    this.line = line;
  }

  createSprite() {
    var lineGraphic = new PIXI.Graphics();
    lineGraphic.position.set(this.line.x1, this.line.y1);
    lineGraphic.lineStyle(3, 0xffffff)
           .moveTo(0, 0)
           .lineTo(this.line.x2 - this.line.x1, this.line.y2 - this.line.y1);
    return lineGraphic;
  }
}
