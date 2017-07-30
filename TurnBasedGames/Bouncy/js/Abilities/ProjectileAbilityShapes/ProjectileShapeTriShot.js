/* Params
 * [TODO] bullet_waves (int) -- the number of bullets to be fired.
 */
class ProjectileShapeTriShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
  }

  appendIconHTML($container) {
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 10px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 20px; left: 15px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 20px; left: 35px;"
      })
    );

  }

  getTextDesc() {
    return "3 X " + this.abilityDef.getBaseDamage();
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var i = -1; i <= 1; i++) {
        var angle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        ) + Math.PI / 64.0 * i;
        boardState.addProjectile(
          Projectile.createProjectile(
            this.contactEffect,
            castPoint,
            angle,
            this.unitHitCallback.bind(this),
            this.abilityDef
          )
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
