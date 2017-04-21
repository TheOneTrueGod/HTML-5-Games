class LWP_LaserTurret extends TurretWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship, 
      weaponSlot,
      Textures.light_weapon_platform.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.light_turrets, 0),
      Textures.getTextureFrame(Textures.light_turrets, 2)
    );
  }
}
