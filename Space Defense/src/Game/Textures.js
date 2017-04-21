class AttachmentPoint {
  constructor(x, y, flipped) {
    this.x = x;
    this.y = y;
    this.flipped = flipped;
  }

  isFlipped() {
    return this.flipped;
  }

  getAttachmentAngle() {
    return Math.atan2(this.y, this.x) + Math.PI / 2;
  }

  getAttachmentDist() {
    return (this.x ** 2 + this.y ** 2) ** 0.5
  }
}

var Textures = {
  interceptor: {
    texture: PIXI.Texture.fromImage('../assets/Interceptor.png'),
    width: 21,
    height: 21,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(-3, -5, false),
        new AttachmentPoint(3, -5, true),
      ]
    }
  },
  missile_boat: {
    texture: PIXI.Texture.fromImage('../assets/MissileBoat.png'),
    width: 31,
    height: 38,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(-7, -12, false),
        new AttachmentPoint(7, -12, true),
      ]
    }
  },
  light_weapon_platform: {
    texture: PIXI.Texture.fromImage('../assets/LightWeaponPlatform.png'),
    width: 31,
    height: 50,
    attachmentPoints: {
      weapon: [
        new AttachmentPoint(0, 2, false),
        new AttachmentPoint(0, -13, false),
      ]
    }
  },
  light_turrets: {
    texture: PIXI.Texture.fromImage('../assets/LightTurrets.png'),
    width: 23,
    height: 23,
  },
  projectiles: {
    texture: PIXI.Texture.fromImage('../assets/projectiles.png'),
    width: 11,
    height: 16,
  },
  getTextureFrame(textureData, frame) {
    return new PIXI.Texture(
      textureData.texture,
      new PIXI.Rectangle(0, frame * textureData.height, textureData.width, textureData.height)
    )
  }
}
