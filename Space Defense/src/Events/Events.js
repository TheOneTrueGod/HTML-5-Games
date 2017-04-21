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
