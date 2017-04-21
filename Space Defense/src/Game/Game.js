class GameObj {
  constructor() {
    this.events = new Events();

    this.gameControls = new GameControls(this, 0);

    this.ships = [];
    this.shipsByTeam = {};
    this.bullets = [];
    this.effects = [];
  }

  createShip(shipDef, team) {
    var spawnGap = 20;
    var ship = ShipFactory.buildFromShipDef(shipDef);
    var x = Constants.gameWidth / 2, y = 50;
    var spawnOffsetX = Math.random() * 100;
    var spawnOffsetY = Math.random() * 100;
    switch (team) {
      case 0:
        x = Constants.gameWidth / 2 - spawnGap * 5;
        y = 50;

        spawnOffsetX = (10 - shipDef.data.gridPos.x) * spawnGap;
        spawnOffsetY = (10 - shipDef.data.gridPos.y) * spawnGap;
        break;
      case 1:
        x = Constants.gameWidth / 2 - spawnGap * 5;
        y = Constants.gameHeight - 50 - spawnGap * 10;

        spawnOffsetX = shipDef.data.gridPos.x * spawnGap;
        spawnOffsetY = shipDef.data.gridPos.y * spawnGap;
        break;
    }

    ship.setPosition(
      x + spawnOffsetX,
      y + spawnOffsetY,
      Math.PI * team + Math.PI / 2
    );

    ship.setTeam(team);
    this.addShip(ship);
  }

  createInterceptor(x, y, team) {
    var ship = (new ShipFactory(ShipDef.INTERCEPTOR))
      .setProperty('weaponSet', 'random')
      .build();

    ship.setPosition(
      x + Math.random() * 100,
      y + Math.random() * 100,
      (-Math.PI / 2) * team
    );
    ship.setTeam(team);
    this.addShip(ship);
  }

  createMissileBoat(x, y, team) {
    var ship = (new ShipFactory(ShipDef.MISSILE_BOAT))
      .setProperty('weaponSet', 'random')
      .build();

    ship.setPosition(
      x + Math.random() * 100,
      y + Math.random() * 100,
      (-Math.PI / 2) * team
    );
    ship.setTeam(team);
    this.addShip(ship);
  }

  reset(shipDefList) {
    // TODO: Reset all arrays
    for (var team = 0; team < shipDefList.length; team++) {
      for (var j = 0; j < shipDefList[team].length; j++) {
        var shipDef = shipDefList[team][j];
        this.createShip(shipDef, team);
      }
    }
    /*switch (myComp) {
      case 'interceptors':
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
        this.createInterceptor(50, 300, 0);
      break;
      case 'missile_boats':
        this.createMissileBoat(50, 300, 0);
        this.createMissileBoat(50, 300, 0);
        this.createMissileBoat(50, 300, 0);
        this.createMissileBoat(50, 300, 0);
        this.createMissileBoat(50, 300, 0);
      break;
    }

    this.createInterceptor(550, 300, 1);
    this.createInterceptor(550, 300, 1);
    this.createInterceptor(550, 300, 1);
    this.createInterceptor(550, 300, 1);

    this.createMissileBoat(550, 300, 1);
    this.createMissileBoat(550, 300, 1);*/
  }

  init() {
  }

  addListener(eventType, func) {
    this.events.addListener(eventType, func);
  }

  addShip(ship) {
    this.ships.push(ship);

    this.events.throwEvent(new ShipCreateEvent(ship));

    if (!this.shipsByTeam[ship.team]) {
      this.shipsByTeam[ship.team] = [];
    }
    this.shipsByTeam[ship.team].push(ship);
  }

  changeShipTeam(ship, oldTeam, newTeam) {
    if (this.shipsByTeam[oldTeam] === undefined) {
      return;
    }

    var index = this.shipsByTeam[oldTeam].indexOf(ship);
    if (index === -1) {
      return;
    }

    this.shipsByTeam[oldTeam].slice(index, 1);
    this.shipsByTeam[newTeam].push(ship);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
    this.events.throwEvent(new BulletCreateEvent(bullet));
  }

  addEffect(effect) {
    this.effects.push(effect);
    this.events.throwEvent(new EffectCreateEvent(effect));
  }

  getHostileShips(myTeam) {
    var ships = [];
    for (var team in this.shipsByTeam) {
      if (team != myTeam) {
        for (var key in this.shipsByTeam[team]) {
          var ship = this.shipsByTeam[team][key];
          if (ship.isAlive()) {
            ships.push(ship);
          }
        }
      }
    }
    return ships;
  }

  getShipsOnTeam(team) {
    var ships = [];
    if (this.shipsByTeam[team] !== undefined) {
      for (var key in this.shipsByTeam[team]) {
        var ship = this.shipsByTeam[team][key];
        if (ship.isAlive()) {
          ships.push(ship);
        }
      }
    }
    return ships;
  }

  removeShip(ship) {
    var index = this.ships.indexOf(ship);
    if (index != -1) {
      this.ships.splice(index, 1);
    }

    index = this.shipsByTeam[ship.team].indexOf(ship);
    if (index != -1) {
      this.shipsByTeam[ship.team].splice(index, 1);
    }
  }

  animationFrame(timeScale) {
    for (var i = 0; i < this.ships.length;) {
      this.ships[i].animationFrame(timeScale);
      if (this.ships[i].readyToDelete()) {
        this.events.throwEvent(new BulletDestroyEvent(this.ships[i]));
        this.ships.splice(i, 1);
      } else {
        i++;
      }
    }

    for (var i = 0; i < this.bullets.length;) {
      this.bullets[i].animationFrame(timeScale);
      if (this.bullets[i].readyToDelete()) {
        this.events.throwEvent(new BulletDestroyEvent(this.bullets[i]));
        this.bullets.splice(i, 1);
      } else {
        i++;
      }
    }

    for (var i = 0; i < this.effects.length;) {
      this.effects[i].animationFrame(timeScale);
      if (this.effects[i].readyToDelete()) {
        this.events.throwEvent(new EffectDestroyEvent(this.effects[i]));
        this.effects.splice(i, 1);
      } else {
        i++;
      }
    }
  }
}
