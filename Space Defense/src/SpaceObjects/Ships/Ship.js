class Ship extends ControlledSpaceObject {
  constructor(x, y, angle, team, texture, nonTintTexture, movementTexture) {
    super(x, y, angle);

    this.id = ++Ship.IDIndex;

    this.buildSprite(texture, nonTintTexture, movementTexture);

    this.selectionCircle = this.buildSelectionCircle();

    this.team = team;

    this.size = 8;
    this.maxHealth = 20;
    this.health = this.maxHealth;

    this.armorType = Ship.ARMORTYPE.MEDIUM;

    this.AI = new BombardAI(this);

    this.weapons = [];

    this.selected = false;

    this.setTint(Constants.getColourForTeam(this.team, 1));
  }

  setTarget(target) {
    this.AI.setTarget(target);
  }

  select(value) {
    this.selected = !!value;
    this.selectionCircle.visible = !!value;
  }

  buildSelectionCircle() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawCircle(0, 0, this.size + 5);
    var selectionCircle = this.addChildAt(graphics, 0);
    selectionCircle.visible = false;
    return selectionCircle;
  }

  buildSprite(bodyTexture, nonTintTexture, movementTexture) {
    this.bodySprite = this.addChild(new PIXI.Sprite(bodyTexture));
    this.bodySprite.anchor.x = 0.5;
    this.bodySprite.anchor.y = 0.5;

    if (nonTintTexture) {
      var ntt = this.addChild(new PIXI.Sprite(nonTintTexture));
      ntt.anchor.x = 0.5; ntt.anchor.y = 0.5;
    }

    this.movementTexture = this.addChild(new PIXI.Sprite(movementTexture));
    this.movementTexture.anchor.x = 0.5;
    this.movementTexture.anchor.y = 0.5;
  }

  setPosition(x, y, angle) {
    this.position.x = x;
    this.position.y = y;
    this.angle = angle;
  }

  setTeam(team) {
    Game.changeShipTeam(this, this.team, team);
    this.team = team;
    this.setTint(Constants.getColourForTeam(this.team, 1));
  }

  setAI(newAI) {
    this.AI = newAI;
    return this;
  }

  setTint(tint) {
    this.tint = tint;
    for (var i = 0; i < this.weapons.length; i++) {
      this.weapons[i].setTint(tint);
    }
    this.bodySprite.tint = tint;
  }

  addShipComponent(component) {
    if (component instanceof Weapon) {
      this.weapons.push(component);
      component.setTint(this.tint);
    }
    if (component.addBehind) {
      this.addChildAt(component, 0);
    } else {
      this.addChild(component);
    }

    return this;
  }

  dealDamage(amount) {
    this.health -= amount;
    if (!this.isAlive()) {
      Game.events.throwEvent(new ShipDiedEvent(this));
    }
    this.setTint(Constants.getColourForTeam(this.team, this.health / this.maxHealth));
  }

  readyToDelete() { return this.warpedOut; }

  setupListeners() {
    this.interactive = true;
    this.on('mousedown', this.onClickDown);
    this.on('touchstart', this.onClickDown);
    this.on('mouseup', this.onClickUp);
    this.on('touchend', this.onClickUp);
  }

  onClickDown(event) {
    Game.events.throwEvent(new ShipMouseDownEvent(this, event));
  }

  onClickUp(event) {
    Game.events.throwEvent(new ShipMouseUpEvent(this, event));
  }

  shoot(weapon, target) {
    weapon.shoot(this, target);
  }

  isAlive() {
    return this.health > 0;
  }

  doAI(timescale) {
    if (this.health > 0) {
      this.AI.doAI(timescale);
      for (var component in this.weapons) {
        this.weapons[component].doAI(timescale);
      }
    }
  }

  animationFrame(timescale) {
    if (this.isAlive()) {
      for (var i = 0; i < this.weapons.length; i++) {
        this.weapons[i].animationFrame(timescale);
      }
    }

    call_base(this, 'animationFrame', [timescale]);
  }

  getMinimumWeaponArc() {
    var minArc = Math.PI;
    for (var i = 0; i < this.weapons.length; i++) {
      if (this.weapons[i].weaponArc < minArc) {
        minArc = this.weapons[i].weaponArc;
      }
    }
    return minArc;
  }

  getMaxWeaponRange() {
    var maxRange = 0;
    for (var i = 0; i < this.weapons.length; i++) {
      var weapon = this.weapons[i];
      if (weapon.getRange() > maxRange) {
        maxRange = weapon.getRange();
      }
    }
    return maxRange;
  }
}

Ship.IDIndex = 1;

Ship.ARMORTYPE = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
}
