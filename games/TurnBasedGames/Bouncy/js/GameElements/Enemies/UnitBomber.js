class UnitBomber extends UnitBasic {
  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitCriticalLine(l, 0, 0, t, this, 5), // Top Left
      new UnitCriticalLine(0, t, r, 0, this, 5), // Top Right
      new UnitLine(r, 0, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, 0, this), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_bomber'].texture
    );

    //this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }

  onDelete(boardState) {
    super.onDelete(boardState);
    if (this.health.current <= 0) {
      var num_projectiles = 5;
      for (var i = 0; i < num_projectiles; i++) {
        var angle = Math.PI * 2 * i / num_projectiles - Math.PI / (num_projectiles * 2);
        boardState.addProjectile(
          new EnemyProjectile(
            {x: this.x, y: this.y},
            {x: this.x + Math.cos(angle) * 10, y: this.y + Math.sin(angle) * 10},
            angle,
            {
              'friendly_fire': true,
              'damage_to_players': NumbersBalancer.getUnitAbilityNumber(
                NumbersBalancer.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE
              ),
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
        );
      }
    }
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }
}

UnitBomber.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBomber.AddToTypeMap();
