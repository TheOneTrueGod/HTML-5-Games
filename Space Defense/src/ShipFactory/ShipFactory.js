class ShipFactory {
  constructor(shipType) {
    this.validProperties = {
      'shipType': [
        ShipDef.INTERCEPTOR,
        ShipDef.MISSILE_BOAT,
      ],
      'interceptor': {
        'weaponSet': [
          'missiles',
          'lasers',
          'random',
        ],
        'weapons': ['missile', 'laser']
      },
      'missile_boat': {
        'weaponSet': [
          'missiles',
          'random',
        ],
      }
    }

    this.properties = {
      'shipType': shipType,
      'weapons': null,
      'weaponSet': 'random',
      'team': 0
    }
  }

  static buildFromShipDef(shipDef) {
    return (new ShipFactory(shipDef.type))
      .setProperty('weaponSet', shipDef.weaponSet)
      .setProperty('team', shipDef.team)
      .build();
  }

  build() {
    var shipType = this.properties.shipType;
    if (shipType == 'random') {
      var shipTypes = this.validProperties['shipType'];
      shipType = shipTypes[Math.floor(Math.random() * (shipTypes.length))]
    }
    var ship;
    switch (shipType) {
      case ShipDef.INTERCEPTOR:
        ship = this.buildInterceptor();
        break;
      case ShipDef.MISSILE_BOAT:
        ship = this.buildMissileBoat();
        break;
      case ShipDef.LIGHT_WEAPON_PLATFORM:
        ship = this.buildLightWeaponPlatform();
        break;
      default:
        console.log('invalid ship type "' + shipType + '"');
        ship = this.buildInterceptor();
    }
    ship.setTeam(this.properties.team);
    return ship;
  }

  buildInterceptor() {
    var ship = new Interceptor(0, 0, 0, 0);
    var weaponSet = this.properties.weaponSet;
    if (weaponSet == 'random') {
      var weaponArray = this.validProperties[ShipDef.INTERCEPTOR]['weaponSet'];
      weaponSet = weaponArray[Math.floor(Math.random() * (weaponArray.length - 1))]
    }
    switch (weaponSet) {
      case 'lasers':
        ship
          .addShipComponent(new InterceptorLaser(ship, 0))
          .addShipComponent(new InterceptorLaser(ship, 1))
          .setAI(new SkirmisherAI(ship))
          ;
        break;
      case 'missiles':
        ship
          .addShipComponent(new InterceptorMissile(ship, 0))
          .addShipComponent(new InterceptorMissile(ship, 1))
          .setAI(new BombardAI(ship))
          ;
        break;
      default:
        console.log("Invalid weaponSet '" + this.properties.weaponSet + "'")
        break;
    }
    return ship;
  }

  buildMissileBoat() {
    var ship = new MissileBoat(0, 0, 0, 0);
    var weaponSet = this.properties.weaponSet;
    if (weaponSet == 'random') {
      var weaponArray = this.validProperties[ShipDef.MISSILE_BOAT]['weaponSet'];
      weaponSet = weaponArray[Math.floor(Math.random() * (weaponArray.length - 1))]
    }
    switch (weaponSet) {
      case 'missiles':
        ship
          .addShipComponent(new MissileBoatMissile(ship, 0))
          .addShipComponent(new MissileBoatMissile(ship, 1))
          ;
        break;
      default:
        console.log("Invalid weaponSet '" + this.properties.weaponSet + "'")
        break;
    }
    ship.setAI(new BombardAI(ship));
    return ship;
  }

  buildLightWeaponPlatform() {
    var ship = new LightWeaponPlatform(0, 0, 0, 0);
    var weaponSet = this.properties.weaponSet;
    if (weaponSet == 'random') {
      var weaponArray = this.validProperties[ShipDef.LIGHT_WEAPON_PLATFORM]['weaponSet'];
      weaponSet = weaponArray[Math.floor(Math.random() * (weaponArray.length - 1))]
    }
    switch (weaponSet) {
      case 'turret':
        ship
          .addShipComponent(new LWP_LaserTurret(ship, 0))
          ;
        break;
      default:
        console.log("Invalid weaponSet '" + this.properties.weaponSet + "'")
        break;
    }
    ship.setAI(new BombardAI(ship));
    return ship;
  }

  setProperty(property, value) {
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    } else {
      console.log("Trying to set invalid property [" + property + "] on ship factory");
    }
    return this;
  }

  static createInterceptor() {
    var shipFactory = new ShipFactory(ShipDef.INTERCEPTOR);
    return shipFactory;
  }
}
