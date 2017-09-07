class AbilityStyle {
  constructor(defJSON) {

  }

  createProjectileSprite(projectile) {
    var sprite = new PIXI.Graphics();
    sprite.position.set(projectile.x, projectile.y);
    sprite.beginFill(0xffffff);
    sprite.drawCircle(0, 0, projectile.size);
    return sprite;
  }

  createProjectileTrail(boardState, projectile) {
    if (boardState.tick % 1 == 0) {
      boardState.addProjectile(
        new ProjectileTrailEffect(projectile, projectile.trailLength)
      );
    }
  }

  rotateProjectile(projectile, sprite) { }

  static buildStyle() {
    return {style_name: 'ERROR'};
  }

  static loadFromJSON(json) {
    switch (json.style_name) {
      case 'COLORIZED':
        return new ColorizedAbilityStyle(json);
      case 'SPRITE':
        return new SpriteAbilityStyle(json);
      case 'BULLET_SHEET_SPRITE':
        return new BulletSheetAbilityStyle(json);
      default:
        console.warn("AbilityStyle.loadFromJSON: unsupported style name; [" + json.style_name + "]");
        return new AbilityStyle(json);
    }
  }
}

AbilityStyle.FALLBACK_STYLE = new AbilityStyle({});
