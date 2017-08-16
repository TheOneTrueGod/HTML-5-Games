class BulletSplitHitEffect extends HitEffect {
  constructor(hitEffectDef, abilityDef, projectileShape) {
    super(hitEffectDef, abilityDef);
    this.projectileShape = projectileShape;
  }

  doHitEffect(boardState, unit, intersection, projectile) {
    var castPoint = {x: projectile.x, y: projectile.y};
    var normalizedIntersection = intersection.line.getVector().clone().normalize();
    var normal = Victor(normalizedIntersection.y, -normalizedIntersection.x); // Also try y, -x;
    var angle = normal.angle();
    var num_bullets = idx(this.hitEffectDef, 'num_bullets', 2)
    for (var j = 0; j < num_bullets; j++) {
      var maxIndexOffset = (num_bullets / 2 - 0.5);
      var indexOffset = j - maxIndexOffset;

      var anglePer = (Math.PI / 16.0) / (maxIndexOffset);
      var projectileAngle = angle + anglePer * indexOffset
      boardState.addProjectile(
        Projectile.createProjectile(
          idx(this.hitEffectDef, 'projectile_type', ProjectileShape.ProjectileTypes.HIT),
          castPoint,
          null,
          projectileAngle,
          null,
          {
            hit_effects: this.hitEffectDef['hit_effects'],
            gravity: {x: 0, y: -0.1},
            speed: 4,
            size: Math.floor(projectile.size * 0.75),
            trail_length: Math.floor(projectile.trailLength * 0.75),
            destroy_on_wall: true,
          }
        ).addUnitHitCallback(this.projectileShape.unitHitCallback.bind(this.projectileShape))
      );
    }
  }
}
