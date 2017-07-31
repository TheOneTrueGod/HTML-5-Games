/* Params
 * None
 */
class ProjectileShapeSingleShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
  }

  appendIconHTML($container) {
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 10px; left: 40px;"
      })
    );
  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      );
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

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
