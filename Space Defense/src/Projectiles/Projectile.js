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
