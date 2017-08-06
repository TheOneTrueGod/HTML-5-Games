/* Params
 * [TODO] bullet_waves (int) -- the number of bullets to be fired.
 */
class ProjectileShapeTriShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
    this.bullets_per_side = abilityDef.getOptionalParam('num_bullets_per_side', 1);
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
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return (this.bullets_per_side * 2 + 1) + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var i = -this.bullets_per_side; i <= this.bullets_per_side; i++) {
        var angle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        ) + Math.PI / 48.0 * i;
        boardState.addProjectile(
          Projectile.createProjectile(
            this.contactEffect,
            castPoint,
            angle,
            this.unitHitCallback.bind(this),
            this.abilityDef,
            {'speed': lerp(8, 7, Math.abs(i) / this.bullets_per_side)}
          )
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
