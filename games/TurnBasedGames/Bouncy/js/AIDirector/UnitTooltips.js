class UnitTooltips {
  static createTooltip(unit) {
    let tooltipContainer =
     $('<div>', {
      class: 'unitTooltip',
      unit_id: unit.id,
    });

    let tooltipData = UnitTooltips.getTooltipData(unit);

    tooltipContainer.append(
      $('<div>' + tooltipData.name + '</div>').addClass('unitName')
    );

    tooltipContainer.append(UnitTooltips.getHealthBars(unit));

    if (tooltipData.description !== null) {
      tooltipContainer.append(
        $('<div>' + tooltipData.description + '</div>').addClass('unitDescription')
      );
    }

    let statusEffectContainer = $('<div>').addClass('statusEffectContainer');
    if (unit.getShield().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Shield')
      );
    }

    if (unit.getArmour().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Armour')
      );
    }
    for (var key in unit.statusEffects) {
      let statusEffect = UnitTooltips.getStatusEffectTooltip(unit.statusEffects[key]);
      if (statusEffect) {
        statusEffectContainer.append(statusEffect);
      }
    }

    if (statusEffectContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(statusEffectContainer);
    }

    return tooltipContainer;
  }

  static createZoneTooltip(zone) {
    let tooltipContainer =
     $('<div>', {
      class: 'unitTooltip',
      unit_id: zone.id,
    });

    tooltipContainer.append(
      $('<div>' + UnitTooltips.getZoneName(zone) + '</div>').addClass('unitName')
    );

    tooltipContainer.append(UnitTooltips.getHealthBars(zone));

    const tooltipDescription = UnitTooltips.getZoneDescription(zone);
    if (tooltipDescription !== null) {
      tooltipContainer.append(
        $('<div>' + tooltipDescription + '</div>').addClass('unitDescription')
      );
    }

    let statusEffectContainer = $('<div>').addClass('statusEffectContainer');
    if (zone.getShield().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Shield')
      );
    }

    if (zone.getArmour().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Armour')
      );
    }
    for (var key in zone.statusEffects) {
      let statusEffect = UnitTooltips.getStatusEffectTooltip(unit.statusEffects[key]);
      if (statusEffect) {
        statusEffectContainer.append(statusEffect);
      }
    }

    if (statusEffectContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(statusEffectContainer);
    }

    return tooltipContainer;
  }

  static getHealthBars(unit) {
    let healthContainer = $('<div class="healthBarContainer">');
    let numHealthBars = 0;

    let shieldPct = unit.getShield().current / unit.getShield().max * 100;
    let currShield = unit.getShield().current;
    let maxShield = unit.getShield().max;
    if (maxShield > 0) {
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar shield" style="width: ' + shieldPct + '%;"/> ' +
            '<div class="healthNumber">' + currShield + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    let armourPct = unit.getArmour().current / unit.getArmour().max * 100;
    let currArmour = unit.getArmour().current;
    let maxArmour = unit.getArmour().max;
    if (maxArmour > 0) {
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar armour" style="width: ' + armourPct + '%;"/> ' +
            '<div class="healthNumber">' + currArmour + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    let healthPct = unit.health.current / unit.health.max * 100;
    if (healthPct > 0 || numHealthBars == 0) {
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar" style="width: ' + healthPct + '%;"/> ' +
            '<div class="healthNumber">' + unit.health.current + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    if (numHealthBars == 1) { healthContainer.addClass('oneBar'); }
    else if (numHealthBars == 2) { healthContainer.addClass('twoBar'); }
    else if (numHealthBars == 3) { healthContainer.addClass('threeBar'); }

    return healthContainer;
  }

  static getTooltipData(unit) {
    return {
      'name': UnitTooltips.getUnitName(unit),
      'description': UnitTooltips.getDescription(unit),
    }
  }

  static getZoneName(zone) {
    if (!zone.creatorAbility) {
      console.warn("Zone has no creator ability: " + zone);
      return '<ERROR>';
    }
    switch (zone.creatorAbility.getOptionalParam('zone_type')) {
      case ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD:
        return "Shield";
    }
    return '<Zone>';
  }

  static getZoneDescription(zone) {
    if (!zone.creatorAbility) {
      console.warn("Zone has no creator ability: " + zone);
      return '<ERROR>';
    }
    switch (zone.creatorAbility.getOptionalParam('zone_type')) {
      case ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD:
        return "Blocks bullets.  Dissapears at end of turn.";
    }
    return '<Description>';
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
        return 'A unit carrying a bomb.  It will explode in ' + unit.timeLeft + ' turn' + (unit.timeLeft > 1 ? 's' : '') + ', dealing ' +
          NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE) + ' damage.';
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
    if (statusEffect instanceof ShieldStatusEffect) { return null; }
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
    if (statusEffect == "Armour") {
      return "darkgray";
    } else if (statusEffect == "Shield") {
      return "#c119b9";
    }
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
    if (statusEffect == "Armour") {
      return "Armour";
    } else if (statusEffect == "Shield") {
      return "Shield";
    }
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
    if (statusEffect == "Armour") {
      return "Unit is armoured.  Armour acts as extra health.";
    } else if (statusEffect == "Shield") {
      return "Unit is shielded.  Shields act as extra health.";
    }
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