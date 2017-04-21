class Constants {
  static getColourForTeam(team, healthPct) {
    if (healthPct == undefined || healthPct > 1) {
      healthPct = 1;
    }
    if (healthPct <= 0) {
      return 0x888888;
    }
    healthPct = 1 - healthPct;
    var r = 0xAA * (healthPct);
    var g = 0xAA * (healthPct);
    var b = 0xAA * (healthPct);

    function lerp(start, end, pct) {
      return start - (start - end) * (pct);
    }
    switch (team) {
      case 0:
        r = lerp(0xFF, 0xBB, healthPct);
      break;
      case 1:
        r = lerp(0xFF, 0xBB, healthPct);
        g = lerp(0xBB, 0xAA, healthPct);
      break;
      case 2:
        g = lerp(0xFF, 0xBB, healthPct);
      break;
    }
    return (r << 16) + (g << 8) + b;
  }

  static get gameWidth() {
    return 800;
  }

  static get gameHeight() {
    return 600;
  }
}
