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
