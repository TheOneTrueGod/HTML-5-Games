class Events {
  constructor() {
    this.listeners = {};
  }

  addListener(eventType, func) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(func);
  }

  throwEvent(event) {
    if (this.listeners[event.type]) {
      for (var i = 0; i < this.listeners[event.type].length; i++) {
        this.listeners[event.type][i](event);
      }
    }
  }
}

class Event {
  constructor(type) {
    this.type = type;
  }
}

class ButtonClickEvent extends Event {
  constructor(button_name, data) {
    super("button_click");
    this.button_name = button_name;
    this.data = data;
  }
}

class GameStartEvent extends Event {
  constructor(shipDefList) {
    super("game_start");
    this.shipDefList = shipDefList;
  }
}

class ShipAddedEvent extends Event {
  constructor(ship_def) {
    super("ship_added");
    this.ship_def = ship_def;
  }
}

class ShipCreateEvent extends Event {
  constructor(ship) {
    super('ship_create');
    this.ship = ship;
  }
}

class ShipDiedEvent extends Event {
  constructor(ship) {
    super('ship_died');
    this.ship = ship;
  }
}

class ShipDestroyEvent extends Event {
  constructor(ship) {
    super('ship_destroy');
    this.ship = ship;
  }
}

class EffectCreateEvent extends Event {
  constructor(effect) {
    super('effect_create');
    this.effect = effect;
  }
}

class EffectDestroyEvent extends Event {
  constructor(effect) {
    super('effect_destroy');
    this.effect = effect;
  }
}

class BulletCreateEvent extends Event {
  constructor(bullet) {
    super('bullet_create');
    this.bullet = bullet;
  }
}

class BulletDestroyEvent extends Event {
  constructor(bullet) {
    super('bullet_destroy');
    this.bullet = bullet;
  }
}

class ShipMouseDownEvent extends Event {
  constructor(ship) {
    super('ship_mouse_down');
    this.ship = ship;
    this.event = event;
  }
}

class ShipMouseUpEvent extends Event {
  constructor(ship, event) {
    super('ship_mouse_up');
    this.ship = ship;
    this.event = event;
  }
}

class GameMouseDownEvent extends Event {
  constructor(event) {
    super('game_mouse_down');
    this.event = event;
  }
}

class GameMouseUpEvent extends Event {
  constructor(event) {
    super('game_mouse_up');
    this.event = event;
  }
}

class GameMouseMotionEvent extends Event {
  constructor(event) {
    super('game_mouse_motion');
    this.event = event;
  }
}

class Constants {
  static getColourForTeam(team, healthPct) {
    if (healthPct == undefined || healthPct > 1) {
      healthPct = 1;
    }
    if (healthPct <= 0) {
      return 0x888888;
    }
    healthPct = 1 - healthPct;
    var r = 0xAA * (healthPct);
    var g = 0xAA * (healthPct);
    var b = 0xAA * (healthPct);

    function lerp(start, end, pct) {
      return start - (start - end) * (pct);
    }
    switch (team) {
      case 0:
        r = lerp(0xFF, 0xBB, healthPct);
      break;
      case 1:
        r = lerp(0xFF, 0xBB, healthPct);
        g = lerp(0xBB, 0xAA, healthPct);
      break;
      case 2:
        g = lerp(0xFF, 0xBB, healthPct);
      break;
    }
    return (r << 16) + (g << 8) + b;
  }

  static get gameWidth() {
    return 800;
  }

  static get gameHeight() {
    return 600;
  }
}

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

class GameControls {
  constructor(game, team) {
    this.selectedShips = [];

    this.team = 0;
    this.mouseDownPos = null;
    this.currMousePos = [0, 0];
    this.shipDownOn = null;
    this.shipUpOn = null;

    game.addListener('ship_mouse_down', (event) => {
      this.shipDownOn = event.ship;
    });
    game.addListener('ship_mouse_up', (event) => {
      if (this.shipDownOn == event.ship) {
        this.selectShip(event.ship);
      }
      this.shipUpOn = event.ship;
    });
    game.addListener('game_mouse_down', (event) => {
      this.mouseDownPos = [
        event.event.data.originalEvent.offsetX,
        event.event.data.originalEvent.offsetY
      ];
    });
    game.addListener('game_mouse_up', (event) => {
      if ((!this.shipUpOn || !this.shipDownOn) && this.mouseDownPos) {
        var mouseUpPos = [
          event.event.data.originalEvent.offsetX,
          event.event.data.originalEvent.offsetY
        ];
        if (
          Math.abs(mouseUpPos[0] - this.mouseDownPos[0]) < 10 &&
          Math.abs(mouseUpPos[1] - this.mouseDownPos[1]) < 10
        ) {
          this.sendOrderToSelectedShips(new AIMovementOrder(this.mouseDownPos[0], this.mouseDownPos[1]));
        } else {
          this.deselectAllShips();
          this.selectYourShipsInSquare(this.mouseDownPos, mouseUpPos);
        }
      }
      this.mouseDownPos = null;
      this.shipDownOn = null;
      this.shipUpOn = null;
    });

    game.addListener('game_mouse_motion', (event) => {
      this.currMousePos = [
        event.event.data.originalEvent.offsetX,
        event.event.data.originalEvent.offsetY
      ];
    });
  }

  selectYourShipsInSquare(mPos0, mPos1) {
    var topLeft = [Math.min(mPos0[0], mPos1[0]), Math.min(mPos0[1], mPos1[1])];
    var botRight = [Math.max(mPos0[0], mPos1[0]), Math.max(mPos0[1], mPos1[1])];
    var yourShips = Game.getShipsOnTeam(this.team);
    for (var i = 0; i < yourShips.length; i++) {
      var ship = yourShips[i];
      if (
        topLeft[0] <= ship.position.x &&
        ship.position.x <= botRight[0] &&
        topLeft[1] <= ship.position.y &&
        ship.position.y <= botRight[1]
      ) {
        this.selectedShips[ship.id] = ship;
        ship.select(true);
      }
    }
  }

  sendOrderToSelectedShips(order) {
    for (var id in this.selectedShips) {
      var ship = this.selectedShips[id];
      ship.AI.giveOrder(order);
    }
  }

  selectShip(ship) {
    if (ship.team == this.team) {
      this.deselectAllShips();

      this.selectedShips[ship.id] = ship;
      ship.select(true);
    } else {
      this.selectedShips.forEach((selectedShip) => {
        selectedShip.setTarget(ship);
      });
    }
  }

  deselectAllShips() {
    for (var key in this.selectedShips) {
      this.selectedShips[key].select(false);
    }
    this.selectedShips = [];
  }
}

class AttachmentPoint {
  constructor(x, y, flipped) {
    this.x = x;
    this.y = y;
    this.flipped = flipped;
  }

  isFlipped() {
    return this.flipped;
  }

  getAttachmentAngle() {
    return Math.atan2(this.y, this.x) + Math.PI / 2;
  }

  getAttachmentDist() {
    return (this.x ** 2 + this.y ** 2) ** 0.5
  }
}

var Textures = {
  interceptor: {
    texture: PIXI.Texture.fromImage('assets/Interceptor.png'),
    width: 21,
    height: 21,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(-3, -5, false),
        new AttachmentPoint(3, -5, true),
      ]
    }
  },
  missile_boat: {
    texture: PIXI.Texture.fromImage('assets/MissileBoat.png'),
    width: 31,
    height: 38,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(-7, -12, false),
        new AttachmentPoint(7, -12, true),
      ]
    }
  },
  light_weapon_platform: {
    texture: PIXI.Texture.fromImage('assets/LightWeaponPlatform.png'),
    width: 31,
    height: 50,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(0, 2, false),
        new AttachmentPoint(0, -13, false),
      ]
    }
  },
  light_turrets: {
    texture: PIXI.Texture.fromImage('assets/LightTurrets.png'),
    width: 23,
    height: 23,
  },
  projectiles: {
    texture: PIXI.Texture.fromImage('assets/Projectiles.png'),
    width: 11,
    height: 16,
  },
  getTextureFrame(textureData, frame) {
    return new PIXI.Texture(
      textureData.texture,
      new PIXI.Rectangle(0, frame * textureData.height, textureData.width, textureData.height)
    )
  }
}

/**
 * Call super method of the given object and method.
 * This function create a temporary variable called "_call_base_reference",
 * to inspect whole inheritance linage. It will be deleted at the end of inspection.
 *
 * Usage : Inside your method use call_base(this, 'method_name', arguments);
 *
 * @param {object} object The owner object of the method and inheritance linage
 * @param {string} method The name of the super method to find.
 * @param {array} args The calls arguments, basically use the "arguments" special variable.
 * @returns {*} The data returned from the super method.
 */
function call_base(object, method, args) {
    // We get base object, first time it will be passed object,
    // but in case of multiple inheritance, it will be instance of parent objects.
    var base = object.hasOwnProperty('_call_base_reference') ? object._call_base_reference : object,
    // We get matching method, from current object,
    // this is a reference to define super method.
            object_current_method = base[method],
    // Temp object wo receive method definition.
            descriptor = null,
    // We define super function after founding current position.
            is_super = false,
    // Contain output data.
            output = null;
    while (base !== undefined) {
        // Get method info
        descriptor = Object.getOwnPropertyDescriptor(base, method);
        if (descriptor !== undefined) {
            // We search for current object method to define inherited part of chain.
            if (descriptor.value === object_current_method) {
                // Further loops will be considered as inherited function.
                is_super = true;
            }
            // We already have found current object method.
            else if (is_super === true) {
                // We need to pass original object to apply() as first argument,
                // this allow to keep original instance definition along all method
                // inheritance. But we also need to save reference to "base" who
                // contain parent class, it will be used into this function startup
                // to begin at the right chain position.
                object._call_base_reference = base;
                // Apply super method.
                output = descriptor.value.apply(object, args);
                // Property have been used into super function if another
                // call_base() is launched. Reference is not useful anymore.
                delete object._call_base_reference;
                // Job is done.
                return output;
            }
        }
        // Iterate to the next parent inherited.
        base = Object.getPrototypeOf(base);
    }
}

function get_angle_between(angle1, angle2) {
  var deltaAng = angle2 - angle1;
  if (deltaAng < -Math.PI) { deltaAng += Math.PI * 2; }
  else if (deltaAng > Math.PI) { deltaAng -= Math.PI * 2; }
  return deltaAng;
}

function get_angle_to_point(point1, point2) {
  return Math.atan2(
    point2.y - point1.y,
    point2.x - point1.x
  );
}

function dist(point1, point2) {
  return ((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) ** 0.5
}

function get_highest_priority_in_list(list, priorityCallback) {
  var highestPri = 0;
  var selected = [];
  for (var key in list) {
    var elementPri = priorityCallback(list[key]);
    if (
      !highestPri && elementPri > 0
      || elementPri > highestPri
    ) {
      highestPri = elementPri;
      selected = [list[key]]
    } else if (elementPri > 0 && elementPri == highestPri) {
      selected.push(list[key]);
    }
  }
  return selected;
}

class AI {
  constructor(object) {
    this.object = object;
    this.target = null;
    this.order = null;
  }

  giveOrder(order) {
    this.order = order;
  }

  getTargetPriority(target) {
    return 1000 - dist(target.position, this.object.position);
  }

  getTargetPriorityFunction() {
    return (target) => {
      return this.getTargetPriority(target);
    };
  }

  setTarget(target) {
    this.target = target;
  }

  pickTarget() {
    if (!this.target || !this.target.isAlive()) {
      var hostiles = Game.getHostileShips(this.object.team);
      if (hostiles) {
        var bestTargets = get_highest_priority_in_list(hostiles, this.getTargetPriorityFunction());
        var targ = Math.random() * bestTargets.length;
        targ = Math.floor(targ);
        this.setTarget(bestTargets[targ]);
      }
    }
  }

  doAI(timescale) {
  }

  doSpecialAI(timescale) {
    if (
      Game.getHostileShips(this.object.team).length == 0 &&
      this.object instanceof ControlledSpaceObject
    ) {
      this.object.warp();
      return false;
    }
    return true;
  }

  doOrderAI() {
    if (!this.order) { return true; }

    if (this.order instanceof AIMovementOrder) {
      var target = {position: {
        x: this.order.position.x,
        y: this.order.position.y,
      }};

      var deltaAngle = this.object.turnTowardsTarget(target);
      if (Math.abs(deltaAngle) <= Math.PI / 6) {
        this.object.accelerate();
        if (10 >= dist(this.object.position, this.order.position)) {
          this.order = null;
        }
      }
    }
    return false;
  }

  fireWeaponsInRange(deltaAngle) {
    for (var i = 0; i < this.object.weapons.length; i++) {
      if (
        (this.object.position.x - this.target.position.x) ** 2 +
        (this.object.position.y - this.target.position.y) ** 2 <
        this.object.weapons[i].getRange() ** 2 &&
        Math.abs(deltaAngle) < this.object.weapons[i].weaponArc
      ) {
        this.object.shoot(this.object.weapons[i], this.target);
      }
    }
  }

  getAngleBasedPriority(basePri, angleBetween, minArc) {
    if (Math.abs(angleBetween) <= minArc) {
      basePri += 1000;
    }
    if (Math.abs(angleBetween) <= Math.PI / 8.0) {
      basePri += 1000;
    }
    if (Math.abs(angleBetween) <= Math.PI / 4.0) {
      basePri += 1000;
    }

    return basePri;
  }
}

class SkirmisherAI extends AI {
  constructor(object) {
    super(object);
    this.wasFacing = false;
    this.coastTime = 50;
    this.coastingFor = this.coastTime;
  }

  doAI(timescale) {
    if (!this.doSpecialAI()) {
      return false;
    }

    if (!this.doOrderAI()) {
      return false;
    }
    this.pickTarget();
    if (this.target) {
      var deltaAngle = get_angle_between(
        this.object.angle,
        get_angle_to_point(this.object.position, this.target.position)
      );
      if (
        this.wasFacing &&
        this.coastingFor <= this.coastTime
      ) {
        this.coastingFor ++;
        this.object.accelerate();
      } else {
        this.coastingFor = 0;
        this.wasFacing = false;
        deltaAngle = this.object.turnTowardsTarget(this.target);
        if (Math.abs(deltaAngle) <= Math.PI / 6) {
          this.object.accelerate();
          if (10 >= dist(this.object.position, this.target.position)) {
            this.wasFacing = true;
          }
        }
      }

      this.fireWeaponsInRange(deltaAngle);
    }
  }
}

class BombardAI extends AI {
  constructor(object) {
    super(object);
  }

  getTargetPriority(target) {
    const IN_FRONT = 5000;
    const BY_FLANK = 4000;
    const BASE_PRI = 2000;

    var angleBetween = get_angle_between(
      this.object.angle,
      get_angle_to_point(this.object.position, target.position)
    );
    var minArc = this.object.getMinimumWeaponArc();
    var d = dist(target.position, this.object.position);
    var pri = this.getAngleBasedPriority(
      BASE_PRI,
      angleBetween,
      minArc
    );

    if (d >= this.object.getMaxWeaponRange()) {
      pri -= 1000;
    }

    return pri;
  }

  doAI(timescale) {
    if (!this.doSpecialAI()) {
      return false;
    }

    if (!this.doOrderAI()) {
      return false;
    }
    this.pickTarget();

    if (this.target) {
      var maxRange = this.object.getMaxWeaponRange();

      var deltaAngle = this.object.turnTowardsTarget(this.target);
      if (
        (this.object.position.x - this.target.position.x) ** 2 +
        (this.object.position.y - this.target.position.y) ** 2 >
        maxRange ** 2
      ) {
        this.object.accelerate();
      } else {
        this.fireWeaponsInRange(deltaAngle);
        this.object.brake();
      }
    }
  }
}

class TurretAI extends AI {
  constructor(turret) {
    super(turret);
  }

  getTargetPriority(target) {
    var d = dist(target.position, this.object.ship.position);
    if (d <= this.object.weaponRange) {
      var angleBetween = get_angle_between(
        this.object.angle,
        get_angle_to_point(this.object.position, target.position)
      );
      var pri = this.getAngleBasedPriority(
        1000,
        angleBetween,
        Math.PI / 16.0
      );
      return pri - dist(target.position, this.object.position);
    }
    return 0;
  }

  doAI(timescale) {
    if (!this.doSpecialAI()) {
      return false;
    }

    if (!this.doOrderAI()) {
      return false;
    }
    this.pickTarget();
    if (this.target) {
      var deltaAngle = this.object.turnTowardsTarget(this.target);

      if (
        (this.object.ship.position.x - this.target.position.x) ** 2 +
        (this.object.ship.position.y - this.target.position.y) ** 2 <
        this.object.getRange() ** 2 &&
        Math.abs(deltaAngle) < this.object.weaponArc
      ) {
        this.object.aiInstructedShoot(this.target);
      }
    } else {
      this.object.turnTowardsTarget({position: {
        x: this.object.ship.position.x + Math.cos(this.object.ship.angle),
        y: this.object.ship.position.y + Math.sin(this.object.ship.angle),
      }})
    }
  }
}

class AIMovementOrder {
  constructor(x, y) {
    this.position = {x: x, y: y};
  }
}

class Effect extends PIXI.Container {
  readyToDelete() {
    return true;
  }

  animationFrame(timescale) {
  }
}

class ExplosionEffect extends Effect {
  constructor(x, y, angle, time, endRadius, startAlpha) {
    super();
    var radius = 4;
    this.startPosition = new PIXI.Point(x, y);
    this.position.x = x;
    this.position.y = y;

    this.totalTime = time;
    this.time = this.totalTime;
    this.startAlpha = startAlpha ? startAlpha : 0.2;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();

    graphics.beginFill(0x00AA00);
    graphics.drawCircle(0, 0, radius / 2);
    graphics.endFill();

    graphics.beginFill(0x00AA00);
    graphics.moveTo(0, 0);
    graphics.lineTo(100, 100);
    graphics.endFill();

    var bodySprite = this.addChild(graphics);

    this.endRadius = endRadius;
    this.angle = angle + Math.PI / 2;
    this.rotation = this.angle;
  }

  readyToDelete() {
    return this.time <= 0;
  }

  static createExplosion(position, angle, radius) {
    var totalParticles = 10;
    for (var i = 0; i < totalParticles; i++) {
      Game.addEffect(new ExplosionEffect(
        position.x,
        position.y,
        angle + Math.PI * 2 * i / totalParticles,
        10,
        radius + Math.random() * radius * 0.2,
        0.5
      ));
    }
  }

  animationFrame(timescale) {
    this.time -= timescale;

    var pct = this.startAlpha * this.time / this.totalTime;
    this.alpha = Math.min(Math.max(pct, 0), this.startAlpha);

    var radiusPct = Math.min(Math.max((1 - this.time / this.totalTime) / 0.5, 0), 1);
    this.position.x = this.startPosition.x + Math.cos(this.angle) * radiusPct * this.endRadius;
    this.position.y = this.startPosition.y + Math.sin(this.angle) * radiusPct * this.endRadius;
  }
}

class MovementEffect extends Effect {
  constructor(x, y, angle, texture, time, startAlpha) {
    super();
    this.position.x = x;
    this.position.y = y;

    this.totalTime = time;
    this.time = this.totalTime;
    this.startAlpha = startAlpha ? startAlpha : 0.2;

    var bodySprite = this.addChild(new PIXI.Sprite(texture));

    bodySprite.anchor.x = 0.5;
    bodySprite.anchor.y = 0.5;
    this.rotation = angle + Math.PI / 2;
  }

  readyToDelete() {
    return this.time <= 0;
  }

  animationFrame(timescale) {
    this.time -= timescale;

    var pct = this.startAlpha * this.time / this.totalTime;

    this.alpha = Math.min(Math.max(pct, 0), this.startAlpha);
  }
}

class Component extends PIXI.Sprite {
  constructor(ship, texture) {
    super(texture);
    this.cooldown = 0;
    this.cooldownTime = 10;
    this.ship = ship;
  }

  animationFrame(timescale) {
    this.cooldown = Math.max(this.cooldown - timescale, 0);
  }

  setTint(tint) {
    this.tint = tint;
  }

  doAI(timescale) {

  }

  get addBehind() {
    return true;
  }
}

class Weapon extends Component {
  constructor(ship, texture, attachmentPointDef) {
    super(ship, texture);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    if (attachmentPointDef.isFlipped()) {
      this.scale.x = -1;
    }
    this.projectileSpawnAngle = attachmentPointDef.getAttachmentAngle();
    this.projectileSpawnDistance = attachmentPointDef.getAttachmentDist();

    this.weaponRange = 100;
  }

  getProjectilePositionX(ship) {
    return ship.position.x + Math.cos(this.projectileSpawnAngle + ship.angle) * this.projectileSpawnDistance;
  }

  getProjectilePositionY(ship) {
    return ship.position.y + Math.sin(this.projectileSpawnAngle + ship.angle) * this.projectileSpawnDistance;
  }

  getRange() {
    return this.weaponRange;
  }

  shoot() {

  }
}

class MissileWeapon extends Weapon {
  constructor(ship, weaponSlot, attachmentPoint, texture) {
    super(ship, texture, attachmentPoint);
    this.cooldownTime = 90;
    this.weaponRange = 300;

    this.weaponArc = Math.PI / 64.0;
  }

  shoot(ship, target) {
    if (this.cooldown <= 0) {
      var angleOffset = 0;
      Game.addBullet(new SmallMissile(
        this.getProjectilePositionX(ship),
        this.getProjectilePositionY(ship),
        ship.angle + angleOffset,
        5 /* BULLET SPEED */,
        this.weaponRange,
        ship.team
      ));
      this.cooldown = this.cooldownTime;
    }
  }

  setTint(tint) {}

  animationFrame(timescale) {
    super.animationFrame(timescale);
    if (this.cooldown > 0) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
}

class LaserWeapon extends Weapon {
  constructor(ship, weaponSlot, attachmentPoint, texture) {
    super(ship, texture, attachmentPoint);
    this.cooldownTime = 10;
    this.weaponRange = 150;

    this.weaponArc = Math.PI / 8.0;
  }

  shoot(ship, target) {
    if (this.cooldown <= 0) {
      var angleOffset = (Math.random() - 0.5) * Math.PI / 16;
      Game.addBullet(new SmallLaser(
        this.getProjectilePositionX(ship),
        this.getProjectilePositionY(ship),
        ship.angle + angleOffset,
        10 /* BULLET SPEED */,
        this.weaponRange,
        ship.team
      ));
      this.cooldown = this.cooldownTime;
    }
  }
}

class TurretWeapon extends Weapon {
  constructor(
    ship,
    weaponSlot,
    attachmentPoint,
    baseTexture,
    weaponTexture
  ) {
    super(ship, null, attachmentPoint);
    this.position.y = 2;
    this.cooldownTime = 30;
    this.weaponRange = 200;

    this.baseSprite = this.addChild(new PIXI.Sprite(baseTexture));
    this.weaponSprite = this.addChild(new PIXI.Sprite(weaponTexture));

    this.weaponSprite.anchor.x = 0.5;
    this.weaponSprite.anchor.y = 0.5;

    this.baseSprite.anchor.x = 0.5;
    this.baseSprite.anchor.y = 0.5;

    this.turnRadius = 0.05;
    this.weaponArc = Math.PI / 8.0;

    this.aimAngle = 0;

    this.AI = new TurretAI(this);
  }

  turnTowardsTarget(target) {
    var targetPos = {x: 0, y: 0};
    targetPos.x = target.position.x;// + Math.cos(target.moveAngle) * target.moveSpeed * 10;
    targetPos.y = target.position.y;// + Math.sin(target.moveAngle) * target.moveSpeed * 10;

    var targetAngle = Math.atan2(
      targetPos.y - this.ship.position.y,
      targetPos.x - this.ship.position.x
    );

    var deltaAng = get_angle_between(this.aimAngle, targetAngle);

    if (deltaAng < 0) {
      this.aimAngle += Math.max(-this.turnRadius, deltaAng);
    } else {
      this.aimAngle += Math.min(this.turnRadius, deltaAng);
    }
    return deltaAng;
  }

  aiInstructedShoot(target) {
    if (this.cooldown <= 0) {
      for (var i = 0; i < 5; i++) {
        var angleOffset = (Math.random() - 0.5) * Math.PI / 16;
        Game.addBullet(new SmallLaser(
          this.getProjectilePositionX(this.ship),
          this.getProjectilePositionY(this.ship),
          angleOffset + this.aimAngle,
          10 - Math.random() /* BULLET SPEED */,
          this.weaponRange,
          this.ship.team
        ));
      }
      this.cooldown = this.cooldownTime;
    }
  }

  doAI(timescale) {
    this.AI.doAI();
  }

  setTint(tint) {
    this.weaponSprite.tint = tint;
  }

  get team() {
    return this.ship.team;
  }

  animationFrame(timescale) {
    super.animationFrame(timescale);

    this.weaponSprite.rotation = this.aimAngle - this.ship.angle;
  }

  get addBehind() {
    return false;
  }
}

class InterceptorLaser extends LaserWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.interceptor.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.interceptor, 2)
    );
  }
}

class InterceptorMissile extends MissileWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.interceptor.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.interceptor, 3)
    );
  }
}

class LWP_LaserTurret extends TurretWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.light_weapon_platform.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.light_turrets, 0),
      Textures.getTextureFrame(Textures.light_turrets, 2)
    );
  }
}

class MissileBoatMissile extends MissileWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.missile_boat.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.missile_boat, 3)
    );
  }
}

class SpaceObject extends PIXI.Container {
  constructor(x, y, texture) {
    super();
    this.position.set(x, y);
    this.size = 10;
    this.setupListeners();
    this.buildBodySprite(texture);
  }

  buildBodySprite(texture) {
    if (texture) {
      this.bodySprite = this.addChild(new PIXI.Sprite(texture));
      this.bodySprite.anchor.x = 0.5;
      this.bodySprite.anchor.y = 0.5;
    }
  }

  setupListeners() {}

  adjustSpriteRotation(angle) {
    this.rotation = this.angle + Math.PI / 2;
  }

  readyToDelete() { return true; }

  animationFrame(timescale) {

  }
}

class ControlledSpaceObject extends SpaceObject {
  constructor(x, y, angle, texture) {
    super(x, y, texture);
    this.accelerating = false;
    this.breaking = false;
    this.warping = false;

    this.angle = angle;
    this.moveAngle = this.angle;
    this.moveSpeed = 0;

    this.accel = 0.005;
    this.maxSpeed = 2;
    this.warpSpeed = this.maxSpeed * 2;
    this.turnRadius = 0.03;
    this.weaponArc = Math.PI / 8;
    this.warpedOut = false;
  }

  accelerate() {
    this.warping = false;
    this.accelerating = true;
    this.breaking = false;
  }

  brake() {
    this.accelerating = false;
    this.breaking = true;
    this.warping = false;
  }

  warp() {
    this.accelerating = false;
    this.breaking = false;
    this.warping = true;
  }

  doAI(timescale) {

  }

  turnTowardsTarget(target) {
    var targetPos = {x: 0, y: 0};
    var xOffset = 0;
    var yOffset = 0;

    if (target.moveAngle && target.moveSpeed) {
      xOffset = Math.cos(target.moveAngle) * target.moveSpeed * 10;
      yOffset = Math.sin(target.moveAngle) * target.moveSpeed * 10;
    }
    targetPos.x = target.position.x + xOffset;
    targetPos.y = target.position.y + yOffset;

    var targetAngle = Math.atan2(
      targetPos.y - this.position.y,
      targetPos.x - this.position.x
    );

    var deltaAng = get_angle_between(this.angle, targetAngle);

    if (deltaAng < 0) {
      this.angle += Math.max(-this.turnRadius, deltaAng);
    } else {
      this.angle += Math.min(this.turnRadius, deltaAng);
    }
    return deltaAng;
  }

  createMovementEffect(timescale, offsetX, offsetY) {

  }

  getMovementTexture() {
    return null;
  }

  doCarMovement(timescale) {
    if (this.warping) {
      this.createMovementEffect(timescale, 0, 0);
      this.moveSpeed = Math.min(this.moveSpeed + this.accel * timescale * 2, this.warpSpeed);
      this.movementTexture.visible = true;
      if (this.moveSpeed >= this.warpSpeed) {
        this.warpedOut = true;
        this.visible = false;
        for (var i = 0; i < 30; i++) {
          this.createMovementEffect(timescale,
            Math.cos(this.angle) * i * this.moveSpeed,
            Math.sin(this.angle) * i * this.moveSpeed,
            30 + i * 3
          );
        }
      }
    } else if (this.accelerating) {
      this.createMovementEffect(timescale, 0, 0);
      this.moveSpeed = Math.min(this.moveSpeed + this.accel * timescale, this.maxSpeed);
      this.movementTexture.visible = true;
    } else if (this.breaking) {
      this.moveSpeed *= 0.98;
      this.movementTexture.visible = false;
    } else {
      this.moveSpeed *= 0.995;
      this.movementTexture.visible = false;
    }
    this.position.x += Math.cos(this.angle) * this.moveSpeed * timescale;
    this.position.y += Math.sin(this.angle) * this.moveSpeed * timescale;
  }

  doShipMovement(timescale) {
    if (this.accelerating) {
      var xSpeed = Math.cos(this.moveAngle) * this.moveSpeed;
      var ySpeed = Math.sin(this.moveAngle) * this.moveSpeed;
      var xAccel = Math.cos(this.angle) * this.accel * timescale;
      var yAccel = Math.sin(this.angle) * this.accel * timescale;
      this.moveAngle = Math.atan2(ySpeed + yAccel, xSpeed + xAccel);
      this.moveSpeed = Math.min(((xSpeed + xAccel) ** 2 + (ySpeed + yAccel) ** 2) ** 0.5, this.maxSpeed);
      this.movementTexture.visible = true;
    } else if (this.breaking) {
      this.moveSpeed *= 0.98;
      this.movementTexture.visible = false;
    } else {
      this.moveSpeed *= 0.995;
      this.movementTexture.visible = false;
    }
    this.position.x += Math.cos(this.moveAngle) * this.moveSpeed * timescale;
    this.position.y += Math.sin(this.moveAngle) * this.moveSpeed * timescale;
  }

  animationFrame(timescale) {
    this.accelerating = false;
    this.breaking = false;

    this.doAI(timescale);

    if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    } else if (this.angle < 0) {
      this.angle += Math.PI * 2;
    }

    this.adjustSpriteRotation(this.angle);

    this.doCarMovement(timescale);

    if (this.position.x > 800) {
      this.position.x = 0;
    } else if (this.position.x <= 0) {
      this.position.x = 800;
    }
    if (this.position.y > 600) {
      this.position.y = 0;
    } else if (this.position.y <= 0) {
      this.position.y = 600;
    }
  }
}

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

class Interceptor extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.interceptor, 0),
      null,
      Textures.getTextureFrame(Textures.interceptor, 1)
    );

    this.size = 8;
    this.maxHealth = 50;
    this.health = this.maxHealth;

    this.armorType = Ship.ARMORTYPE.LIGHT;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    //ExplosionEffect.createExplosion(this.position, this.angle);
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.interceptor, 1),
      duration ? duration : 20
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Container();
    var weapon = sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 2)));
    //weapon.anchor.x = 0.5;
    //weapon.anchor.y = 0.5;
    var flipWeapon = sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 2)));
    flipWeapon.scale.x = -1;
    flipWeapon.position.x = 0;
    flipWeapon.position.y = 0;
    //flipWeapon.anchor.x = 0.5;
    //flipWeapon.anchor.y = 0.5;

    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.interceptor, 0)));
    return sprite;
  }
}

class LightWeaponPlatform extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.light_weapon_platform, 0),
      Textures.getTextureFrame(Textures.light_weapon_platform, 1),
      Textures.getTextureFrame(Textures.light_weapon_platform, 2)
    );

    this.size = 15;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.turnRadius = 0.01;
    this.weaponArc = Math.PI / 32;

    this.armorType = Ship.ARMORTYPE.HEAVY;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.light_weapon_platform, 2),
      duration ? duration : 50
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 0));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 1)));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.light_weapon_platform, 3)));
    return sprite;
  }
}

class MissileBoat extends Ship {
  constructor(x, y, angle, team) {
    super(x, y, angle, team,
      Textures.getTextureFrame(Textures.missile_boat, 0),
      Textures.getTextureFrame(Textures.missile_boat, 1),
      Textures.getTextureFrame(Textures.missile_boat, 2)
    );

    this.size = 15;
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.turnRadius = 0.01;
    this.weaponArc = Math.PI / 32;
  }

  createMovementEffect(timescale, offsetX, offsetY, duration) {
    Game.addEffect(new MovementEffect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.angle,
      Textures.getTextureFrame(Textures.missile_boat, 2),
      duration ? duration : 50
    ));
  }

  static getSpriteForShipDef(shipDef) {
    var sprite = new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 0));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 1)));
    sprite.addChild(new PIXI.Sprite(Textures.getTextureFrame(Textures.missile_boat, 3)));
    return sprite;
  }
}

class DamageType {
  constructor(damageMap) {
    if (damageMap['default'] === undefined) {
      throw "Damage maps must have a default entry";
    }
    this.amount = damageMap['default'];
    this.damageMap = damageMap;
  }

  damageTarget(target) {
    var amount = this.amount;
    if (target.armorType) {
      if (this.damageMap[target.armorType]) {
        amount = this.damageMap[target.armorType];
      }
    }

    target.dealDamage(amount);
  }
}

class Projectile extends SpaceObject {
  constructor(x, y, angle, speed, team, range, texture) {
    super(x, y, texture);
    this.scale.x = 0.5;
    this.scale.y = 0.5;
    this.speed = speed;
    this.angle = angle;
    this.timeAlive = 0;
    this.lifetime = (range + 10) / speed;
    this.team = team;
    this.setTint(Constants.getColourForTeam(this.team));
    this.size = 2;
    this.damage = new DamageType({'default': 1});
  }

  setTint(tint) {
    this.bodySprite.tint = tint;
  }

  readyToDelete() { return this.timeAlive >= this.lifetime; }

  animationFrame(timescale) {
    this.createMovementEffect(timescale);
    this.adjustSpriteRotation(this.angle);
    this.position.x += Math.cos(this.angle) * this.speed * timescale;
    this.position.y += Math.sin(this.angle) * this.speed * timescale;
    this.timeAlive += timescale;

    var targetHit = this.checkForCollisions();
    if (targetHit) {
      this.timeAlive = this.lifetime;
      this.damage.damageTarget(targetHit);
      this.doCollisionEffects();
    }
  }

  createMovementEffect(timescale) {
  }

  doCollisionEffects() {

  }

  checkForCollisions() {
    var all_units = Game.getHostileShips(this.team);
    for (var key in all_units) {
      var unit = all_units[key];
      if ((this.position.x - unit.x) ** 2 + (this.position.y - unit.y) ** 2 < (this.size + unit.size) ** 2) {
        return unit;
      }
    }
    return null;
  }
}

class SmallLaser extends Projectile {
  constructor(x, y, angle, speed, range, team) {
    super(x, y, angle, speed, team, range, Textures.getTextureFrame(Textures.projectiles, 0));
    this.damage = new DamageType({'default': 1, 'light': 4}); // Bonus damage to interceptors
  }
}

class SmallMissile extends Projectile {
  constructor(x, y, angle, speed, range, team) {
    super(x, y, angle, speed, team, range, Textures.getTextureFrame(Textures.projectiles, 1));
    var fireSprite = new PIXI.Sprite(Textures.getTextureFrame(Textures.projectiles, 2));
    fireSprite.anchor.x = 0.5;
    fireSprite.anchor.y = 0.5;
    this.addChild(fireSprite);
    this.damage = new DamageType({'default': 10, 'light': 5, 'heavy': 15}); // Bonus damage to heavy armour
  }

  setTint(tint) {
  }

  doCollisionEffects() {
    ExplosionEffect.createExplosion(this.position, this.angle, 10);
  }

  createMovementEffect(timescale) {
    Game.addEffect(new MovementEffect(
      this.position.x,
      this.position.y,
      this.angle,
      Textures.getTextureFrame(Textures.projectiles, 2),
      7,
      0.3
    ));
  }
}

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

class MainScreen extends Screen {
  init() {
    var selectedShip = 'interceptors';

    this.gameScreen = this.addChildScreen("game", (new GameScreen()).init())
      .addListener("button_click", (event) => {
        switch (event.button_name) {
          case "next_level":
            this.pbbs.loadNextMission();
            this.showScreen("main_menu");
            break;
            // NO BREAK
          case "retry_level":
            this.pbbs.reloadMission();
            this.showScreen("main_menu");
            break;
        }
      });
    this.pbbs = this.addChildScreen("main_menu", (new PointBuyBattleScreen())
      .init())
      .addListener("button_click", (event) => {
        switch (event.button_name) {

        }
      })
      .addListener("game_start", (event) => {
        this.gameScreen.resetGameState();
        Game.reset(event.shipDefList);
        this.showScreen("game");
      });

    this.showScreen("main_menu");
    return this;
  }
}

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

class FleetPreview extends PIXI.Container {
  constructor(x, y, width, height) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.width = width;
    this.height = height;

    this.gridWidth = 10;
    this.gridHeight = 10;

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.beginFill(0xCCCCCC);
    graphics.fillAlpha = 0.5;
    graphics.drawRect(0, 0, width, height);
    this.addChildAt(graphics, 0);

    this.gridSlots = [];

    this.shipDefs = [];
  }

  packageShipDefs() {
    return this.shipDefs;
  }

  clear() {
    var toRemove = [];
    for (var i = this.children.length - 1; i >= 1; i--) {
      this.removeChild(this.children[i]);
    }

    this.shipDefs = [];

    this.gridSlots = [];
    for (var x = 1; x < this.gridWidth; x++) {
      for (var y = 1; y < this.gridHeight; y++) {
        this.gridSlots.push({x, y});
      }
    }
  }

  removeShip(shipDef) {
    this.gridSlots.push(shipDef.data.gridPos);
    this.removeChild(shipDef.data.shipSprite);
    this.shipDefs.splice(this.shipDefs.indexOf(shipDef), 1);
  }

  addShip(shipDef, clickCallback) {
    if (this.gridSlots.length <= 0) {
      return false;
    }

    var slotWidth = this.width / this.gridWidth;
    var slotHeight = this.height / this.gridHeight;

    var shipSprite = shipDef.getSprite();

    var gridSlot = Math.floor(Math.random() * this.gridSlots.length);
    var gridPos = this.gridSlots[gridSlot];
    this.gridSlots.splice(gridSlot, 1);

    // TODO: Offset by 0.5 * slotWidth when you have a full ship here.
    shipSprite.position.x = Math.floor(gridPos.x * slotWidth);
    shipSprite.position.y = Math.floor(gridPos.y * slotHeight);

    //shipSprite.anchor.x = 0.5;
    //shipSprite.anchor.y = 0.5;

    var shipDefCopy = shipDef.copy();
    shipDefCopy.setData({gridPos, shipSprite})
    this.shipDefs.push(shipDefCopy);

    shipSprite.interactive = true;
    shipSprite.on('mousedown', this.createShipOnClick(shipDefCopy, clickCallback));
    shipSprite.on('touchstart', this.createShipOnClick(shipDefCopy, clickCallback));

    return this.addChild(shipSprite);
  }

  createShipOnClick(shipDef, clickCallback) {
    return () => {
      if (clickCallback) {
        clickCallback(shipDef);
      }
    }
  }
}

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

class MissionDef {
  constructor(enemyShips) {
    this.enemyShips = enemyShips;
  }
}

MissionDef.getMissionDef = function (missionID) {
  return this.missionDefs[missionID];
}

MissionDef.missionDefs = [
  new MissionDef([
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new MissileBoatShipDef(1),
    new MissileBoatShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new MissileBoatShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
  ]),
  new MissionDef([
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1)
  ]),
  new MissionDef([
    new LightWeaponPlatformShipDef(1), new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1), new MissileBoatShipDef(1),
    new MissileBoatShipDef(1), new MissileBoatShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1)
  ]),
];

var renderer = PIXI.autoDetectRenderer(
  Constants.gameWidth,
  Constants.gameHeight,
  {backgroundColor : 0x222222}
);
document.body.appendChild(renderer.view);

var Game = new GameObj();
var mainScreen = (new MainScreen()).init();

Game.init();

// start animating
function animate() {
  const timeScale = 1;
  mainScreen.animationFrame(timeScale);

  requestAnimationFrame(animate);
  // render the root container
  mainScreen.render(renderer);
}

animate();
