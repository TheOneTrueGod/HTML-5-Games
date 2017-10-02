class Unit {
  constructor(x, y, owner, id) {
    this.x = x;
    this.y = y;
    this.gameSprite = null;
    this.owner = owner;
    if (!id) {
      this.id = MainGame.boardState.getUnitID();
    } else {
      this.id = id;
    }
    this.selectedSprite = null;
    this.moveTarget = null;

    // See Also Unit.UNIT_SIZE
    this.physicsWidth = Unit.UNIT_SIZE;
    this.physicsHeight = Unit.UNIT_SIZE;
    this.collisionBox = [];
    var health = NumbersBalancer.getUnitHealth(this);
    this.health = {current: health, max: health};
    this.readyToDel = false;

    this.damage = 1;

    this.statusEffects = {};
    this.spawnedThisTurn = true;

    this.healthBarSprites = {
      textSprite: null,
      bar: null
    };
    this.effectSprites = {};

    this.createCollisionBox();
  }

  canProjectileHit() { return true; }

  createCollisionBox() {}

  doUnitActions(boardState) {}

  createTooltip() {
    let tooltipContainer =
     $('<div>', {
      class: 'unitTooltip',
      unit_id: this.id,
    });

    let tooltipData = UnitTooltips.getTooltipData(this);

    tooltipContainer.append(
      $('<div>' + tooltipData.name + '</div>').addClass('unitName')
    );

    let healthPct = this.health.current / this.health.max * 100;
    tooltipContainer.append(
      $('<div>' +
          '<div class="healthBar" style="width: ' + healthPct + '%;"/> ' +
          '<div class="healthNumber">' + tooltipData.health + '</div>' +
        '</div>').addClass('unitHealth')
    );

    if (tooltipData.description !== null) {
      tooltipContainer.append(
        $('<div>' + tooltipData.description + '</div>').addClass('unitDescription')
      );
    }

    let statusEffectContainer = $('<div>').addClass('statusEffectContainer');
    for (var key in this.statusEffects) {
      let statusEffect = UnitTooltips.getStatusEffectTooltip(this.statusEffects[key]);
      if (statusEffect) {
        statusEffectContainer.append(statusEffect);
      }
    }

    if (statusEffectContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(statusEffectContainer);
    }

    return tooltipContainer;
  }

  getStatusEffect(effect) {
    return this.statusEffects[effect.getEffectType()];
  }

  hasStatusEffect(effect) {
    return effect.getEffectType() in this.statusEffects;
  }

  isAlive() {
    return this.health.current > 0;
  }

  setHealth(amount) {
    this.health.current = Math.max(amount, 0);
    if (this.health.current <= 0) {
      this.readyToDel = true;
    }

    if (this.healthBarSprites.textSprite && this.gameSprite) {
      this.createHealthBarSprite(this.gameSprite);
    }
  }

  dealDamage(boardState, amount) {
    var damageMult = 1;
    for (var key in this.statusEffects) {
      damageMult *= this.statusEffects[key].getDamageMultiplier()
    }
    var maxDamageDealt = this.health.current;
    var damageToDeal = Math.max(amount * damageMult, 0);

    if (this.hasStatusEffect(ShieldStatusEffect)) {
      var shieldEffect = this.statusEffects[ShieldStatusEffect.getEffectType()];
      maxDamageDealt += shieldEffect.health.current;
      damageToDeal -= shieldEffect.dealDamage(Math.floor(Math.max(damageToDeal, 0)));

      if (shieldEffect.readyToDelete()) {
        this.removeStatusEffect(shieldEffect.getEffectType());
      }
    }

    maxDamageDealt = maxDamageDealt / Math.max(damageMult, 0.00001)

    this.setHealth(this.health.current - Math.floor(Math.max(damageToDeal, 0)));
    if (amount > 0) {
      boardState.resetNoActionKillSwitch();
    }

    return Math.min(maxDamageDealt, amount);
  }

  readyToDelete() {
    return this.readyToDel;
  }

  getCollisionBox() {
    if (this.readyToDelete()) { return []; }
    if (this.memoizedCollisionBox) {
      return this.memoizedCollisionBox;
    }
    var self = this;
    var collisionLines = this.collisionBox;
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      var t = -this.physicsHeight / 2;
      var b = this.physicsHeight / 2;
      var r = this.physicsWidth / 2;
      var l = -this.physicsWidth / 2;
      var offset = 0;
      collisionLines = [
        new UnitLine(l - offset, t, r + offset, t, this), // Top
        new UnitLine(r, t - offset, r, b + offset, this), // Right
        new UnitLine(r + offset, b, l - offset, b, this), // Bottom
        new UnitLine(l, b + offset, l, t - offset, this), // Left
      ];
    }

    this.memoizedCollisionBox = collisionLines.map((line) => {
      return line.clone().addX(this.x).addY(this.y);
    });

    return this.memoizedCollisionBox;
  }

  isFinishedDoingAction() {
    return this.moveTarget === null;
  }

  setMoveTarget(x, y) {
    this.memoizedCollisionBox = null;
    this.moveTarget = {'x': x, 'y': y};
  }

  canSelect() {
    return false;
  }

  setSelected(selected) {
    if (this.selectedSprite) {
      this.selectedSprite.visible = selected;
    }
  }

  serialize() {
    var serialized_status_effects = [];
    for (var key in this.statusEffects) {
      serialized_status_effects.push(this.statusEffects[key].serialize());
    }
    var serialized = {
      'x': this.x,
      'y': this.y,
      'health': this.health.current,
      'status_effects': serialized_status_effects,
      'moveTarget': null,
      'unitType': this.constructor.name,
      'owner': this.owner,
      'id': this.id,
      'data': this.serializeData()
    };
    if (this.moveTarget) {
      serialized.moveTarget = {
        'x': this.moveTarget.x,
        'y': this.moveTarget.y,
      };
    }

    return serialized;
  }

  serializeData() {
    return {};
  }

  loadSerializedData(data) {

  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
    sprite.anchor.set(0.5);
    return sprite;
  }

  getCurrentPosition() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x, y: y};
  }

  getTopLeft() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x - this.physicsWidth / 2, y: y - this.physicsWidth / 2};
  }

  getBottomRight() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x + this.physicsWidth / 2, y: y + this.physicsWidth / 2};
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();
    for (var effect in this.statusEffects) {
      this.addEffectSprite(effect);
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }

  removeFromStage() {
    if (this.gameSprite && this.gameSprite.parent) {
      var stage = this.gameSprite.parent;
      stage.removeChild(this.gameSprite);
      return stage;
    }
    return null;
  }

  doMovement(boardState) {
  }

  startOfPhase(boardState, phase) {
    for (var key in this.statusEffects) {
      if (phase === TurnPhasesEnum.ENEMY_ACTION) {
        this.statusEffects[key].turnStart(boardState, this);
      }
      this.statusEffects[key].startOfPhase(boardState, phase, this);
      if (this.statusEffects[key].readyToDelete()) {
        this.removeStatusEffect(key);
      }
    }
  }

  addStatusEffect(effect) {
    this.removeEffectSprite(effect.getEffectType());
    this.statusEffects[effect.getEffectType()] = effect;
    this.memoizedCollisionBox = null;
    this.addEffectSprite(effect.getEffectType());
  }

  removeEffectSprite(effect) {
    if (effect in this.effectSprites) {
      var sprite = this.effectSprites[effect];
      sprite.parent.removeChild(sprite);
      delete this.effectSprites[effect];
      this.memoizedCollisionBox = null;
    }
    if (this.gameSprite && effect == ShieldStatusEffect.getEffectType()) {
      this.gameSprite.filters = [];
    }
  }

  addEffectSprite(effect) {
  }

  removeStatusEffect(effect) {
    if (effect in this.statusEffects) {
      delete this.statusEffects[effect];
      this.removeEffectSprite(effect);
    }
  }

  endOfPhase(boardState, phase) {
    if (phase === TurnPhasesEnum.ENEMY_SPAWN) {
      for (var key in this.statusEffects) {
        this.statusEffects[key].turnEnd(boardState, this);
        if (this.statusEffects[key].readyToDelete()) {
          this.removeStatusEffect(key);
        }
      }
    }
  }

  triggerHit(boardState, unit, intersection, projectile) {}

  runTick(boardState) {
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  getSize() {
    return {
      left: 0, right: 0, top: 0, bottom: 0
    };
  }

  getSelectionRadius() { return 20; }

  preventsUnitEntry(unit) {
    return true;
  }

  onDelete(boardState) {
    for (var key in this.statusEffects) {
      this.statusEffects[key].onUnitDeleting(boardState, this);
    }
  }
}

Unit.loadFromServerData = function(serverData) {
  var x = 0;
  var y = 0;
  var owner = 0;
  var UnitClass = Unit;
  var id = null;
  if (serverData.x) { x = serverData.x; }
  if (serverData.y) { y = serverData.y; }
  if (serverData.owner) { owner = serverData.owner; }
  if (serverData.unitType) {
    if (!(serverData.unitType in Unit.UnitTypeMap)) {
      alert(serverData.unitType + " not in Unit.UnitTypeMap.");
    } else {
      UnitClass = Unit.UnitTypeMap[serverData.unitType];
    }
  }
  if (serverData.id) { id = serverData.id; }
  var unit = new UnitClass(x, y, owner, id);
  if (serverData.health) { unit.setHealth(serverData.health); }
  if (serverData.moveTarget) {
    unit.setMoveTarget(serverData.moveTarget.x, serverData.moveTarget.y);
  }
  if (serverData.status_effects) {
    for (var i = 0; i < serverData.status_effects.length; i++) {
      var status_effect = serverData.status_effects[i];
      unit.addStatusEffect(StatusEffect.fromServerData(status_effect));
    }
  }
  if (serverData.data) {
    unit.loadSerializedData(serverData.data);
  }
  return unit;
}

Unit.UNIT_SIZE = 50;
Unit.UnitTypeMap = {
};
Unit.AddToTypeMap = function() {
  Unit.UnitTypeMap[this.name] = this;
}
