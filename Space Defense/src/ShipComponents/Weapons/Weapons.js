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
