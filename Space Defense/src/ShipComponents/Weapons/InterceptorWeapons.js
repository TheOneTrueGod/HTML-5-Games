class InterceptorLaser extends LaserWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.interceptor.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.interceptor, 2)
    );
  }
}

class InterceptorMissile extends MissileWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship, 
      weaponSlot,
      Textures.interceptor.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.interceptor, 3)
    );
  }
}
