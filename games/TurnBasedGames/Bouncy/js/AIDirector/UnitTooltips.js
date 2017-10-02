class UnitTooltips {
  static getTooltipData(unit) {
    return {
      'name': UnitTooltips.getUnitName(unit),
      'health': unit.health.current,
      'description': UnitTooltips.getDescription(unit),
    }
  }

  static getUnitName(unit) {
    switch (unit.constructor.name) {
      case 'UnitBasicSquare':
      case 'UnitBasicDiamond':
        return 'Basic';
        break;
      case 'UnitFast':
        return 'Fast';
        break;
      case 'UnitShover':
      case 'UnitHeavy':
        return 'Strong';
        break;
      case 'UnitBomber':
        return 'Bomber';
        break;
      case 'UnitKnight':
        return 'Knight';
        break;
      case 'UnitProtector':
        return 'Protector';
        break;
      case 'UnitShooter':
        return 'Shooter';
        break;

    }
    console.warn('no unit name for [' + unit.constructor.name + ']');
    return '<' + unit.constructor.name + '>';
  }

  static getDescription(unit) {
    switch (unit.constructor.name) {
      case 'UnitBasicSquare':
      case 'UnitBasicDiamond':
        return null;
        break;
      case 'UnitFast':
        return 'Moves 2 spaces every turn';
        break;
      case 'UnitShover':
      case 'UnitHeavy':
        return null;
        break;
      case 'UnitBomber':
        return 'Bomber';
        break;
      case 'UnitKnight':
        return 'Every turn, the knight creates three shields in front of itself.' +
          '  Each shield has ' + NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD) + ' health.';
        break;
      case 'UnitProtector':
        let numTargets = NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD_NUM_TARGETS);
        let shieldVal = NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD);
        return 'Every turn, the protector shields ' + numTargets + ' nearby units.' +
          '  Each shield has ' + shieldVal + ' health.';
        break;
      case 'UnitShooter':
        let damage = NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.SHOOTER_DAMAGE);
        return 'Shoots every turn dealing ' + damage + ' damage.';
        break;

    }
    console.warn('no description for [' + unit.constructor.name + ']');
    return '<no description>';
  }

  static getStatusEffectTooltip(statusEffect) {
    var name = UnitTooltips.getStatusEffectName(statusEffect);
    var effect = UnitTooltips.getStatusEffectDescription(statusEffect);
    if (!name && !effect) {
      console.warn('no status effect for [' + statusEffect.constructor.name + ']');
      return null;
    }
    let colour = UnitTooltips.getEffectColour(statusEffect);
    return $('<div>' +'<span style="color:' + colour + '">' + name + '</span> - ' + effect + '</div>');
  }

  static getEffectColour(statusEffect) {
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return '#47e549';
      case 'FreezeStatusEffect':
        return '#6666ff';
      case 'InfectStatusEffect':
        return '#db4dff';
    }
    return 'white';
  }

  static getStatusEffectName(statusEffect) {
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return 'Poison';
      case 'FreezeStatusEffect':
        return 'Freeze';
      case 'InfectStatusEffect':
        return 'Infect';
    }
    console.warn('no status effect name for [' + statusEffect.constructor.name + ']');
    return null;
  }

  static getStatusEffectDescription(statusEffect) {
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return 'Deals ' + statusEffect.damage + ' damage per turn for ' + statusEffect.duration + ' turns';
      case 'FreezeStatusEffect':
        return 'The unit is stunned for ' + statusEffect.duration + ' turns';
      case 'InfectStatusEffect':
        return 'If the unit dies within ' + statusEffect.duration + ' turns, it explodes';
    }
    console.warn('no status effect description for [' + statusEffect.constructor.name + ']');
  }
}
