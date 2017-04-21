class MissileBoatMissile extends MissileWeapon {
  constructor(ship, weaponSlot) {
    super(
      ship,
      weaponSlot,
      Textures.missile_boat.attachmentPoints.weapon[weaponSlot],
      Textures.getTextureFrame(Textures.missile_boat, 3)
    );
  }
}
