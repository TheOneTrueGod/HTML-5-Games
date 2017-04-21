class GameScreen extends Screen {
  init() {
    this.effectStage = this.addChild(new PIXI.Container());
    this.bulletStage = this.addChild(new PIXI.Container());
    this.shipStage = this.addChild(new PIXI.Container());

    this.rectGraphics = new PIXI.Graphics();
    this.addChild(this.rectGraphics);

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.fillAlpha = 0;
    graphics.drawRect(0, 0, this.width, this.height);
    this.shipStage.addChildAt(graphics, 0);

    Game.addListener('ship_create', (event) => {
      this.shipStage.addChild(event.ship);
    });

    Game.addListener('bullet_create', (event) => {
      this.bulletStage.addChild(event.bullet);
    });

    Game.addListener('bullet_destroy', (event) => {
      this.bulletStage.removeChild(event.bullet);
    });

    Game.addListener('effect_create', (event) => {
      this.effectStage.addChild(event.effect);
    });

    Game.addListener('effect_destroy', (event) => {
      this.effectStage.removeChild(event.effect);
    });

    Game.addListener('ship_died', (event) => {
      if (Game.getHostileShips(0).length === 0) {
        this.next_level_button.visible = true;
        this.retry_level_button.visible = true;
      }
      if (Game.getShipsOnTeam(0).length === 0) {
        this.retry_level_button.visible = true;
      }
    });

    this.shipStage.interactive = true;
    this.shipStage.on('mousedown', this.onClickDown.bind(this));
    this.shipStage.on('touchstart', this.onClickDown.bind(this));

    this.shipStage.on('mousemove', this.onMouseMove.bind(this));
    this.shipStage.on('touchmove', this.onMouseMove.bind(this));

    this.shipStage.on('mouseup', this.onClickUp.bind(this));
    this.shipStage.on('touchend', this.onClickUp.bind(this));

    this.next_level_button = this.addChild(new Button(
      this.width / 2 - 40, 10,
      150, 50,
      new PIXI.Text('Next Level', {fontFamily : 'Arial', fontSize: '16px', fill : 0x10BB10}),
      () => {
        this.events.throwEvent(new ButtonClickEvent("next_level"));
      }
    ));

    this.retry_level_button = this.addChild(new Button(
      this.width / 2 - 40, 70,
      150, 50,
      new PIXI.Text('Retry Level', {fontFamily : 'Arial', fontSize: '16px', fill : 0x10BB10}),
      () => {
        this.events.throwEvent(new ButtonClickEvent("retry_level"));
      }
    ));

    this.retry_level_button.visible = false;

    return this;
  }

  onClickDown(event) {
    Game.events.throwEvent(new GameMouseDownEvent(event));
  }

  onClickUp(event) {
    Game.events.throwEvent(new GameMouseUpEvent(event));
    this.rectGraphics.clear();
  }

  onMouseMove(event) {
    //Game.events.throwEvent(new GameMouseMotionEvent(event));
    if (Game.gameControls.mouseDownPos) {
      this.rectGraphics.clear();
      this.rectGraphics.lineStyle(2, 0xFFFFFF);
      this.rectGraphics.drawRect(
        Game.gameControls.mouseDownPos[0],
        Game.gameControls.mouseDownPos[1],
        event.data.originalEvent.offsetX - Game.gameControls.mouseDownPos[0],
        event.data.originalEvent.offsetY - Game.gameControls.mouseDownPos[1]
      );
    }
  }

  resetGameState() {
    this.next_level_button.visible = false;
    this.retry_level_button.visible = false;
    for (var i = this.effectStage.children.length - 1; i >= 1; i--) {
      this.effectStage.removeChild(this.effectStage.children[i]);
    }
    for (var i = this.bulletStage.children.length - 1; i >= 1; i--) {
      this.bulletStage.removeChild(this.bulletStage.children[i]);
    }
    for (var i = this.shipStage.children.length - 1; i >= 1; i--) {
      Game.removeShip(this.shipStage.children[i]);
      this.shipStage.removeChild(this.shipStage.children[i]);
    }
  }

  animationFrame(timeScale) {
    Game.animationFrame(timeScale);
  }
}
