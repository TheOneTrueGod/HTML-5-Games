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
        if (
          this.abilityDef.getOptionalParam('projectile_type') ===
          ProjectileShape.ProjectileTypes.FROZEN_ORB
        ) {
          return Math.floor((200 - 20) / 4) + " X " + idx(hitEffects[i], 'base_damage', 0);
        }
        return idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      );
      boardState.addProjectile(
        Projectile.createProjectile(
          this.projectileType,
          castPoint,
          targetPoint,
          angle,
          this.abilityDef
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
        .addTimeoutCallback(this.timeoutCallback.bind(this))
      );
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
