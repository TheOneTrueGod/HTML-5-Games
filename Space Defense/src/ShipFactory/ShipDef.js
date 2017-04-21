class ShipDef {
  static get INTERCEPTOR() { return "interceptor"; }
  static get MISSILE_BOAT() { return "missile_boat"; }
  static get LIGHT_WEAPON_PLATFORM() { return "light_weapon_platform"; }

  constructor(type, weaponSet, team) {
    if (ShipDef.id_value == undefined) {
      ShipDef.id_value = 1;
    }
    this.type = type;
    this.weaponSet = weaponSet;
    this.id = ShipDef.id_value++;
    this.team = team ? team : 0;
    this.data = {};
  }

  setData(data) {
    this.data = data;
  }

  copy() {
    var shipDef = new ShipDef(this.type, this.weaponSet);
    shipDef.setData(this.data);
    return shipDef;
  }

  getSprite() {
    return ShipFactory.buildFromShipDef(this);
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFF0000);
    graphics.beginFill(0xDDAA00);

    if (shipDef.type == ShipDef.MISSILE_BOAT) {
      graphics.beginFill(0x0033BB);
    }
    graphics.fillAlpha = 0.5;
    graphics.drawRect(6, 6, Math.floor(slotWidth - 6), Math.floor(slotHeight - 6));

    var shipSprite = new PIXI.Sprite();
    shipSprite.addChild(graphics);
    return shipSprite;
  }

  get cost() {
    return this.getBodyCost() + this.getWeaponCost();
  }

  getBodyCost() {
    switch (this.type) {
      case ShipDef.INTERCEPTOR:
        return 1;
      case ShipDef.MISSILE_BOAT:
        return 2;
      case ShipDef.LIGHT_WEAPON_PLATFORM:
        return 2;
    }
    return 1;
  }

  getWeaponCost() {
    return 0;
  }
}

class InterceptorShipDef extends ShipDef {
  constructor(team) {
    super(ShipDef.INTERCEPTOR, 'lasers', team);
  }
}

class MissileBoatShipDef extends ShipDef {
  constructor(team) {
    super(ShipDef.MISSILE_BOAT, 'missiles', team);
  }
}

class LightWeaponPlatformShipDef extends ShipDef {
  constructor(team) {
    super(ShipDef.LIGHT_WEAPON_PLATFORM, 'turret', team);
  }
}
