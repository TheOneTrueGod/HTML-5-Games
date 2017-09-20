class SummonUnitAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    this.rawDef = defJSON;

    if (defJSON.unit_abilities) {
      this.loadNestedAbilityDefs(defJSON.unit_abilities);
    }
  }

  getValidTarget(target, playerID) {
    var max_range = this.getOptionalParam('max_range', {left: 0, right: 0, top: 0, bottom: 0});
    if (
      max_range.left === undefined || max_range.right === undefined ||
      max_range.top === undefined || max_range.bottom === undefined
    ) {
      return {x: target.x, y: target.y};
    }

    // TODO: Pass in boardState.  Too lazy right now.
    var castPoint = MainGame.boardState.getPlayerCastPoint(playerID);
    var castPointCoord = MainGame.boardState.sectors.getGridCoord(castPoint);
    var targetCoord = MainGame.boardState.sectors.getGridCoord(target);

    var targX = Math.min(
      Math.max(castPointCoord.x - max_range.left, targetCoord.x),
      castPointCoord.x + max_range.right
    );
    var targY = Math.min(
      Math.max(castPointCoord.y - max_range.top, targetCoord.y),
      castPointCoord.y + max_range.bottom
    );

    return MainGame.boardState.sectors.getPositionFromGrid({x: targX, y: targY});
  }

  getUnitSize() {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    if (tick == 0) {
      var pos = boardState.sectors.snapPositionToGrid(targetPoint);
      var newUnit = new Turret(
        pos.x, pos.y,
        0,
        null,
        this.getOptionalParam('duration', 5),
        this.index
      );
      //newUnit.playSpawnEffect(castPoint, 20);
      boardState.addUnit(newUnit);
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  createAbilityCard() {
    var cardClass = "tempFirstAbil";

    var $card = $("<div>", {
      "class": "abilityCard " + cardClass + "",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    var iconURL = idx(this.rawDef, 'icon', null);
    if (iconURL) {
      var $image = $("<img src='" + iconURL + "'/>");
      $icon.append($image);
    } else {
      var $image = $("<img src='../Bouncy/assets/icon_plain_shield.png'/>");
      $icon.append($image);
    }

    $card.append($icon);

    return $card;
  }

  createTargettingGraphic(startPos, endPos, color) {
    var lineGraphic = new PIXI.Graphics();
    var pos = MainGame.boardState.sectors.snapPositionToGrid(endPos);

    var size = this.getUnitSize();
    var left = ((size.left + 0.5) * Unit.UNIT_SIZE);
    var right = ((size.right + 0.5) * Unit.UNIT_SIZE);
    var top = ((size.top + 0.5) * Unit.UNIT_SIZE);
    var bottom = ((size.bottom + 0.5) * Unit.UNIT_SIZE);

    lineGraphic.position.set(pos.x, pos.y);

    lineGraphic
      .lineStyle(1, color)
      .drawRect(
        -left, -top,
        left + right, top + bottom
      );

    return lineGraphic;
  }
}
