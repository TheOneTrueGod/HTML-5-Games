// Deployables.  If an enemy walks into a turret, it destroys it.
// (1) Shoot a projectile.  All turrets shoot at the cursor this turn as well.
// (2) Place a turret.  Lasts X turns.  Every turn, it shoots a single bullet straight up.
// (3) Place a cannon turret.  Lasts X turns.  Every turn, it shoots
// (4) Landmines.  Shoot a projectile.  When it hits an enemy, (3?) landmines scatter in the 2x3 space below the target.
// (5) Place a bomb on the ground.  After X (3?) turns, it explodes into a bunch
//      of projectiles.  Enemies push the bomb down when they walk into it, and
//      it can damage players


function ClarenceDeck() {
  var abilities = [
    {}
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
