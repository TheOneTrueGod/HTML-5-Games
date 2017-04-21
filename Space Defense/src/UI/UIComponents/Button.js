class Button extends PIXI.Sprite {
  constructor(
    x, y,
    width, height,
    sprite,
    clickCallback
  ) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.interactive = true;
    var buttonImage = this.addChild(sprite);

    if (!width) { width = buttonImage.width + 1; }
    if (!height) { height = buttonImage.height + 1; }

    buttonImage.position.x = (width - buttonImage.width) / 2;
    buttonImage.position.y = (height - buttonImage.height) / 2;

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.beginFill(0xCCCCCC);
    graphics.fillAlpha = 0.5;
    graphics.drawRect(0, 0, width, height);
    this.addChildAt(graphics, 0);

    this.on('mousedown', this.onClick);
    this.on('touchstart', this.onClick);
    if (clickCallback instanceof String) {
      () => {
        //mainMenuScreen.events.throwEvent(new ButtonClickEvent(event));
      }
    } else {
      this.clickCallback = clickCallback;
    }
  }

  onClick() {
    if (this.clickCallback) {
      this.clickCallback();
    }
  }
}
