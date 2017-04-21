class MainMenuScreen extends Screen {
  init() {
    var elementPadding = 10;
    var buttons = [
      {texture: Textures.interceptor, event: "select_ship_interceptor"},
      {texture: Textures.missile_boat, event: "select_ship_missile_boat"},
      {texture: Textures.interceptor, event: "select_ship_interceptor"},
      {texture: Textures.interceptor, event: "select_ship_interceptor"},
      {texture: Textures.interceptor, event: "select_ship_interceptor"}
    ];

    for (var i = 0; i < buttons.length; i++) {
      var buttonWidth = 60;
      var x = this.width / 4
        + i * (buttonWidth + elementPadding)
        - buttons.length * (buttonWidth) / 2
        - (buttons.length - 1) * elementPadding / 2;
      var y = this.height - elementPadding - buttonWidth - elementPadding - 50;

      var mainMenuScreen = this;
      var buttonClick = (event, mainMenuScreen) => {
        return () => {
          this.events.throwEvent(new ButtonClickEvent(event));
        }
      }
      this.addChild(new Button(
        x, y,
        buttonWidth, 60,
        new PIXI.Sprite(Textures.getTextureFrame(buttons[i].texture, 0)),
        buttonClick(buttons[i].event, this)
      ));
    }

    this.addChild(new Button(
      this.width / 4 - 80 / 2, this.height - 10 - 50,
      80, 50,
      new PIXI.Text('Start', {fontFamily : 'Arial', fontSize: '16px', fill : 0xff1010}),
      () => {
        this.events.throwEvent(new ButtonClickEvent("start_game"));
      }
    ));


    this.yourFleetPreview = this.addChild(new FleetPreview(
      elementPadding, elementPadding,
      this.width / 2 - elementPadding * 2, this.height - elementPadding - 60 - elementPadding - 60 - 10
    ));

    this.theirFleetPreview = this.addChild(new FleetPreview(
      this.width / 2 + elementPadding, elementPadding,
      this.width / 2 - elementPadding * 2, this.height - elementPadding - 60 - elementPadding - 60 - 10
    ));
    return this;
  }

  animationFrame(timeScale) {

  }
}
