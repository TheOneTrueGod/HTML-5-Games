class ZoneAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    this.rawDef = defJSON;
    if (
      defJSON.unit_interaction &&
      defJSON.unit_interaction.unit_enter
    ) {
      for (var i = 0; i < this.rawDef.unit_interaction.unit_enter.length; i++) {
        if (this.rawDef.unit_interaction.unit_enter[i].effect == ZoneAbilityDef.UnitEffectTypes.ABILITY) {
          this.rawDef.unit_interaction.unit_enter[i].initializedAbilDef =
            AbilityDef.createFromJSON(this.rawDef.unit_interaction.unit_enter[i].abil_def);
        }
      }
    }
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.rawDef) {
      return this.rawDef[param];
    }
    return defaultValue;
  }

  getZoneSize() {
    var passedSize = this.getOptionalParam('zone_size', {});
    return {
      left: idx(passedSize, 'left', 0),
      right: idx(passedSize, 'right', 0),
      top: idx(passedSize, 'top', 0),
      bottom: idx(passedSize, 'bottom', 0)
    };
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == 0) {
      var pos = boardState.sectors.snapPositionToGrid(targetPoint);
      var newUnit = new ZoneEffect(
        pos.x, pos.y,
        0,
        null,
        this.index
      );
      boardState.addUnit(newUnit);
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  getAbilityHTML() {
    var cardClass = "tempFirstAbil";

    var $card = $("<div>", {
      "class": "abilityCard " + cardClass + "",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);

    return $card;
  }

  createTargettingGraphic(startPos, endPos, color) {
    return super.createTargettingGraphic(startPos, endPos, color);
  }

  unitEnteringZone(boardState, unit, zone) {
    var unitInteraction = this.getOptionalParam('unit_interaction', {});
    idx(unitInteraction, 'unit_enter', []).forEach((enterEffect) => {
      switch (enterEffect.effect) {
        case ZoneAbilityDef.UnitEffectTypes.DAMAGE:
          unit.dealDamage(boardState, idx(enterEffect, 'damage', 100));
          break;
        case ZoneAbilityDef.UnitEffectTypes.ABILITY:
          var abilitySource = idx(enterEffect, 'ability_source', ZoneAbilityDef.AbilitySources.CENTER_ZONE);

          var spotsToHit;
          if (abilitySource === ZoneAbilityDef.AbilitySources.CENTER_ZONE) {
            spotsToHit = [boardState.sectors.getGridPosition(zone)];
          } else if (abilitySource === ZoneAbilityDef.AbilitySources.BELOW_UNIT) {
            spotsToHit = [boardState.sectors.getGridPosition(unit).addScalarY(1)];
          } else if (abilitySource === ZoneAbilityDef.AbilitySources.WHOLE_ZONE) {
            spotsToHit = [];
            var size = this.getZoneSize();
            var coords = boardState.sectors.getGridPosition(zone);
            for (var x = coords.x - size.left; x <= coords.x + size.right; x++) {
              for (var y = coords.y - size.top; y <= coords.y + size.bottom; y++) {
                spotsToHit.push(Victor(x, y));
              }
            }
          }

          var abilDef = enterEffect.initializedAbilDef;
          spotsToHit.forEach((castSector) => {
            var castPoint = castSector.clone().multiplyScalarX(Unit.UNIT_SIZE).multiplyScalarY(Unit.UNIT_SIZE);
            var targetPoint = castSector.clone().addScalarY(-1).multiplyScalarX(Unit.UNIT_SIZE).multiplyScalarY(Unit.UNIT_SIZE)
            abilDef.doActionOnTick(0, boardState, castPoint, targetPoint);
          });
          break;
      }
    })
    zone.decreaseTime(boardState, 1);
  }

  canUnitPassThrough(unit) {
    return !idx(this.getOptionalParam('unit_interaction', {}), 'prevent_unity_entry', true);
  }
}

ZoneAbilityDef.createUnitInteractionJSON = function(
  prevent_unit_entry,
  unit_enter
) {
  return {
    'prevent_unit_entry': prevent_unit_entry,
    'unit_enter': unit_enter
  };
}

ZoneAbilityDef.createUnitEntryDamageInteraction = function(damage) {
  return {
    'effect': ZoneAbilityDef.UnitEffectTypes.DAMAGE,
    'damage': damage
  };
}

ZoneAbilityDef.createUnitEntryAbilityInteraction = function(
  abilityDef,
  abilitySources
) {
  return {
    'effect': ZoneAbilityDef.UnitEffectTypes.ABILITY,
    'ability_source': abilitySources,
    'abil_def': abilityDef
  };
}

ZoneAbilityDef.UnitEffectTypes = {
  DAMAGE: 'DAMAGE',
  ABILITY: 'ABILITY'
};

ZoneAbilityDef.AbilitySources = {
  WHOLE_ZONE: 'WHOLE_ZONE',
  CENTER_ZONE: 'CENTER_ZONE',
  BELOW_UNIT: 'BELOW_UNIT',
}
