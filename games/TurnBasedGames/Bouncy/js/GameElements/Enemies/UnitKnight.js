class UnitKnight extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var s = Unit.UNIT_SIZE / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL
      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2, this), // TR

      new UnitLine(s, -s / 2, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, -s, -s / 2, this), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_knight'].texture
    );

    //this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      for (var i = -1; i <= 1; i++) {
        var castPoint = {x: this.x, y: this.y};
        var targetPoint = {x: this.x + Unit.UNIT_SIZE * i, y: this.y + Unit.UNIT_SIZE};
        var pos = boardState.sectors.snapPositionToGrid(targetPoint);
        if (
          targetPoint.y <= boardState.boardSize.height - Unit.UNIT_SIZE &&
          boardState.sectors.getUnitsAtPosition(targetPoint.x, targetPoint.y).length == 0
        ) {
          UnitKnight.abilityDef.doActionOnTick(0, boardState, castPoint, targetPoint)
        }
      }
    }
  }
}

UnitKnight.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitKnight.createAbilityDef = function() {
  UnitKnight.abilityDef = AbilityDef.createFromJSON({
    'ability_type': AbilityDef.AbilityTypes.ZONE,
    'duration': 1,
    "zone_size":{"left":0,"right":0,"top":0,"bottom":0},
    "zone_health": NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD
    ),
    "sprite": "zone_shield",
    "deletion_phase": TurnPhasesEnum.ENEMY_ACTION,
    "unit_interaction": {
      'prevent_unity_entry': false,
    },
    "projectile_interaction": {
    }
  });
};

UnitKnight.AddToTypeMap();