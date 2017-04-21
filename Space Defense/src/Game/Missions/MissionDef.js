class MissionDef {
  constructor(enemyShips) {
    this.enemyShips = enemyShips;
  }
}

MissionDef.getMissionDef = function (missionID) {
  return this.missionDefs[missionID];
}

MissionDef.missionDefs = [
  new MissionDef([
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new MissileBoatShipDef(1),
    new MissileBoatShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new MissileBoatShipDef(1)
  ]),
  new MissionDef([
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1),
    new LightWeaponPlatformShipDef(1)
  ]),
  new MissionDef([
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new LightWeaponPlatformShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
    new InterceptorShipDef(1),
  ]),
  new MissionDef([
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),

    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1)
  ]),
  new MissionDef([
    new LightWeaponPlatformShipDef(1), new LightWeaponPlatformShipDef(1),
    new MissileBoatShipDef(1), new MissileBoatShipDef(1),
    new MissileBoatShipDef(1), new MissileBoatShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1),
    new InterceptorShipDef(1), new InterceptorShipDef(1), new InterceptorShipDef(1)
  ]),
];
