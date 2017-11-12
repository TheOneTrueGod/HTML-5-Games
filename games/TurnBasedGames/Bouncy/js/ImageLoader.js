class ImageLoader {
  static loadImages(callback) {
      PIXI.loader
        .add("byte", "../Bouncy/assets/byte.png")
        .add("byte_diamond_red", "../Bouncy/assets/byte_diamond_red.png")
        .add("byte_square_red", "../Bouncy/assets/byte_square_red.png")
        .add("enemy_square",  "../Bouncy/assets/enemy_square.png")
        .add("enemy_fast",  "../Bouncy/assets/enemy_fast.png")
        .add("enemy_diamond",  "../Bouncy/assets/enemy_diamond.png")
        .add("enemy_shoot",  "../Bouncy/assets/enemy_shoot.png")
        .add("enemy_shover",  "../Bouncy/assets/enemy_shover.png")
        .add("enemy_strong",  "../Bouncy/assets/enemy_strong.png")
        .add("enemy_bomber",  "../Bouncy/assets/enemy_bomber.png")
        .add("enemy_boss_healer",  "../Bouncy/assets/enemy_boss_healer.png")
        .add("enemy_knight",  "../Bouncy/assets/enemy_knight.png")
        .add("zone_shield",  "../Bouncy/assets/zone_shield.png")
        .add("enemy_protector",  "../Bouncy/assets/enemy_protector.png")
        .add("zone_energy_shield",  "../Bouncy/assets/zone_energy_shield.png")
        .add("effect_heal",  "../Bouncy/assets/effect_heal.png")
        .add("core", "../Bouncy/assets/core.png")
        .add("sprite_explosion",  "../Bouncy/assets/sprites/explosion.png")
        .add("bullet_sheet",  "../Bouncy/assets/sprites/bullet_sheet.png")
        .add("poison_sheet",  "../Bouncy/assets/sprites/poison_sheet.png")
        .add("deployables", "../Bouncy/assets/sprites/deployables.png")
        .load(callback);
  }

  static getSquareTexture(sprite, index) {

    var baseTexture = PIXI.loader.resources[sprite].texture;
    return new PIXI.Texture(baseTexture,
        new PIXI.Rectangle(
          0, baseTexture.width * index,
          baseTexture.width, baseTexture.width
        )
      );
  }
}
