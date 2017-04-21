class PointBuyBattleScreen extends Screen {
  init() {
    // The bonus points you have available
    this.pointsAvailable = 2;
    this.theirPointCost = 0;

    this.current_mission = 0;

    var elementPadding = 10;
    var buttons = [
      {texture: Textures.interceptor, shipDef: new InterceptorShipDef()},
      {texture: Textures.missile_boat, shipDef: new MissileBoatShipDef()},
      {texture: Textures.light_weapon_platform, shipDef: new LightWeaponPlatformShipDef()}
    ];

    for (var i = 0; i < buttons.length; i++) {
      var buttonWidth = 60;
      var buttonHeight = 60;
      var x = this.width / 4
        + i * (buttonWidth + elementPadding)
        - buttons.length * (buttonWidth) / 2
        - (buttons.length - 1) * elementPadding / 2;
      var y = this.height - elementPadding - buttonWidth - elementPadding - 50;

      var mainMenuScreen = this;
      var buttonClick = (shipDef, mainMenuScreen) => {
        return () => {
          if (this.pointsAvailable >= shipDef.cost) {
            this.addYourShip(shipDef);
          }
        }
      }
      var buttonSprite = new Button(
        x, y,
        buttonWidth, buttonHeight,
        new PIXI.Sprite(Textures.getTextureFrame(buttons[i].texture, 0)),
        buttonClick(buttons[i].shipDef, this)
      )
      var cost = buttons[i].shipDef.cost;
      for (var j = 0; j < cost; j++) {
        var sprite = buttonSprite.addChild(new MoneySprite());
        var padding = 4;
        sprite.position.x = (buttonWidth + padding) / 2 + (sprite.width + padding) * (j - cost / 2)
        sprite.position.y = buttonHeight - sprite.height / 2;
      }

      this.addChild(buttonSprite);
    }

    this.addChild(new Button(
      this.width / 4 - 80 / 2, this.height - 10 - 50,
      80, 50,
      new PIXI.Text('Start', {fontFamily : 'Arial', fontSize: '16px', fill : 0xff1010}),
      () => {
        this.events.throwEvent(new GameStartEvent(this.packageShipDefs()));
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

    this.setupMoneyContainer(
      this.theirFleetPreview.x,
      this.theirFleetPreview.y + this.theirFleetPreview.height + elementPadding,
      this.theirFleetPreview.width,
      this.height - this.theirFleetPreview.height - elementPadding * 3
    );
    this.loadMission(0);
    this.setupListeners();

    return this;
  }

  setupMoneyContainer(x, y, width, height) {
    this.moneySprites = [];
    var moneyContainer = new PIXI.Sprite();
    moneyContainer.position.x = x;
    moneyContainer.position.y = y;

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.beginFill(0xCCCCCC);
    graphics.fillAlpha = 0.5;
    graphics.drawRect(0, 0, width, height);

    moneyContainer.addChild(graphics);

    var spriteWidth = (new MoneySprite()).width;
    var spriteHeight = (new MoneySprite()).height;
    var padding = 4;

    var moneyPerRow = Math.floor((width - padding * 2) / (spriteWidth + padding));
    var horizOffset = (width - (moneyPerRow * (spriteWidth + padding)) + padding / 2) / 2;

    var numRows = Math.floor((height - horizOffset) / (spriteHeight + padding));

    for (var i = 0; i < moneyPerRow * numRows; i++) {
      var sprite = moneyContainer.addChild(new MoneySprite());

      sprite.position.x = horizOffset + (sprite.width + padding) * (i % moneyPerRow)
      sprite.position.y = horizOffset + Math.floor(i / moneyPerRow) * (sprite.width + padding);
      this.moneySprites.push(sprite);
    }

    this.addChild(moneyContainer);
  }

  updateMoneySprites() {
    for (var i = 0; i < this.moneySprites.length; i++) {
      this.moneySprites[i].visible = i < this.pointsAvailable;
    }
  }

  setupListeners() {

  }

  getShipPreviewOnClickFunction() {
    return (shipDef) => {
      this.removeYourShip(shipDef);
    }
  }

  packageShipDefs() {
    return [
      this.yourFleetPreview.packageShipDefs(),
      this.theirFleetPreview.packageShipDefs()
    ];
  }

  addYourShip(shipDef) {
    var newShip = this.yourFleetPreview.addShip(shipDef, this.getShipPreviewOnClickFunction());
    if (newShip) {
      this.events.throwEvent(new ShipAddedEvent(shipDef));
    }
    this.pointsAvailable -= shipDef.cost;
    this.updateMoneySprites();
  }

  removeYourShip(shipDef) {
    this.yourFleetPreview.removeShip(shipDef);
    this.pointsAvailable += shipDef.cost;
    this.updateMoneySprites();
  }

  addTheirShip(shipDef) {
    var newShip = this.theirFleetPreview.addShip(shipDef);
    if (newShip) {
      this.events.throwEvent(new ShipAddedEvent(shipDef));
    }
    this.theirPointCost += shipDef.cost;
    this.pointsAvailable += shipDef.cost;
  }

  loadNextMission() {
    this.loadMission(++this.current_mission);
  }

  loadMission(mission_number) {
    this.current_mission = mission_number;
    var mission = MissionDef.getMissionDef(mission_number);
    this.resetFleetPreviews([], mission.enemyShips);
  }

  reloadMission() {
    var mission = MissionDef.getMissionDef(this.current_mission);
    this.resetFleetPreviews([], mission.enemyShips);
  }

  resetFleetPreviews(yours, theirs) {
    this.pointsAvailable = 2;
    this.yourFleetPreview.clear();
    this.theirFleetPreview.clear();

    for (var i = 0; i < theirs.length; i++) {
      this.addTheirShip(theirs[i]);
    }

    /*yours = [];

    for (var i = 0; i < yours.length; i++) {
      this.addYourShip(yours[i]);
    }*/

    this.updateMoneySprites();
  }

  animationFrame(timeScale) {

  }
}

class MoneySprite extends PIXI.Container {
  constructor() {
    super();
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFDF00);
      graphics.beginFill(0xA89200);
    //graphics.fillAlpha = 0.5;
    graphics.drawRect(0, 0, this.width, this.height);
    this.addChild(graphics);
  }

  get width() {
    return 8;
  }

  get height() {
    return 8;
  }
}
