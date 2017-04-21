class Screen extends PIXI.Container {
  constructor() {
    super();
    this.childScreens = {};
    this.currScreen = null;
    this.events = new Events();
  }

  get width() {
    return Constants.gameWidth;
  }

  get height() {
    return Constants.gameHeight;
  }

  addListener(eventType, func) {
    this.events.addListener(eventType, func);
    return this;
  }

  addChildScreen(name, screen) {
    this.childScreens[name] = screen;
    this.addChild(screen);
    screen.visible = false;
    return screen
  }

  showScreen(name) {
    if (this.childScreens[name]) {
      if (this.currScreen) {
        this.childScreens[this.currScreen].visible = false;
      }
      this.currScreen = name;
      if (this.currScreen) {
        this.childScreens[this.currScreen].visible = true;
      }
    }
  }

  init() {
    return this;
  }

  render(renderer) {
    renderer.render(this);
  }

  animationFrame(timeScale) {
    if (this.currScreen) {
      this.childScreens[this.currScreen].animationFrame(timeScale);
    }
  }
}
