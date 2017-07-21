/* Params
 * bullet_waves (int) [4] -- the number of bullets to be fired.
 * bullet_wave_delay (int) [10] -- the gap between each wave of bullets
 */
class ProjectileShapeChainShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.num_waves = abilityDef.getOptionalParam('bullet_waves', 4);
    var wave_delay = abilityDef.getOptionalParam('bullet_wave_delay', 10);
    this.ACTIVATE_ON_TICKS = {1: 1};
    this.FINAL_TICK = 1;
    for (var i = 1; i < this.num_waves; i++) {
      this.ACTIVATE_ON_TICKS[i * wave_delay] = i * wave_delay;
      this.FINAL_TICK = i * wave_delay;
    }
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
        "style": "top: 20px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 30px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 40px; left: 25px;"
      })
    );
  }

  appendIconDescHTML($container) {

  }

  getTextDesc() {
    return this.num_waves + " X " + this.abilityDef.getBaseDamage();
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick in this.ACTIVATE_ON_TICKS) {
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      );
      boardState.addProjectile(
        Projectile.createProjectile(
          this.contactEffect,
          castPoint,
          angle,
          this.unitHitCallback.bind(this)
        )
      );
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.FINAL_TICK;
  }
}
