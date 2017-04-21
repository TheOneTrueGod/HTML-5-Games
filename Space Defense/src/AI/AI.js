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
