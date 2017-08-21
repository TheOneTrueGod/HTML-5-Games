class UnitProtector extends UnitBasic {
  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l - offset, t, r + offset, t, this), // Top
      new UnitLine(r, t - offset, r, 0, this), // Right
      new UnitLine(r, 0, 0, b, this), // Bottom Right
      new UnitLine(0, b, l, 0, this), // Bottom Left
      new UnitLine(l, 0, l, t - offset, this), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_protector'].texture
    );

    //this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    return sprite;
  }

  onDelete(boardState) {
    if (this.health.current <= 0) {
      var num_projectiles = 5;
      for (var i = 0; i < num_projectiles; i++) {
        var angle = Math.PI * 2 * i / num_projectiles - Math.PI / (num_projectiles * 2);
        boardState.addProjectile(
          new EnemyProjectile(
            {x: this.x, y: this.y},
            {x: this.x + Math.cos(angle) * 10, y: this.y + Math.sin(angle) * 10},
            angle,
            {'friendly_fire': true}
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

UnitProtector.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}


UnitProtector.createAbilityDef = function() {
  //UnitKnight.abilityDef = Abi
}

UnitProtector.AddToTypeMap();
