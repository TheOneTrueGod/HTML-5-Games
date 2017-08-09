class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    if (!defJSON['shape'] || !defJSON['contact_effect']) {
      throw new Error("shape and contact_effect are required in a ProjectileAbilityDef");
    }

    this.shapeType = defJSON['shape'];
    this.contactEffect = defJSON['contact_effect'];
    this.hitEffects = defJSON['hit_effects'] ?
      defJSON['hit_effects'] :
      [ProjectileShape.HitEffects.DAMAGE];
    this.rawDef = defJSON;

    this.shape = ProjectileShape.getProjectileShape(defJSON['shape'], this);
  }

  getHitEffects() {
    return this.hitEffects;
  }

  getContactEffect() {
    return this.contactEffect;
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.rawDef) {
      return this.rawDef[param];
    }
    return defaultValue;
  }

  doActionOnTick(tick, boardState, castPoint, targetPoint) {
    this.shape.doActionOnTick(tick, boardState, castPoint, targetPoint);
  }

  hasFinishedDoingEffect(tickOn) {
    return this.shape.hasFinishedDoingEffect(tickOn);
  }

  createAbilityCard() {
    var cardClass = "tempFirstAbil";

    var $card = $("<div>", {
      "class": "abilityCard",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);
    var iconURL = idx(this.rawDef, 'icon', null);
    if (iconURL) {
      var $image = $("<img src='" + iconURL + "'/>");
      $icon.append($image);
    } else {
      this.shape.appendIconHTML($icon);
    }

    var $iconDesc = this.shape.getIconDescHTML($iconDesc);
    if ($iconDesc) {
      var $iconDesc = $("<div>", {"class": "abilityCardIconDesc"}).append($iconDesc);
      $card.append($iconDesc);
    }

    var $textDesc = $("<div>", {"class": "abilityCardTextDesc"});
    $card.append($textDesc);
    this.shape.appendTextDescHTML($textDesc);

    return $card;
  }

  createTargettingGraphic(startPos, endPos, color) {
    if (this.shape.createTargettingGraphic) {
      return this.shape.createTargettingGraphic(startPos, endPos, color);
    } else {
      // Create a new Graphics object and add it to the scene
      var lineGraphic = new PIXI.Graphics();
      const circleSize = 8;
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
      var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      dist -= circleSize;
      lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y)
        .lineTo(
          startPos.x + Math.cos(angle) * dist,
          startPos.y + Math.sin(angle) * dist
        );

      lineGraphic.drawCircle(endPos.x, endPos.y, circleSize);

      lineGraphic.beginFill(color);
      lineGraphic.drawCircle(endPos.x, endPos.y, circleSize / 3);

      return lineGraphic;
    }
  }
}

ProjectileAbilityDef.Shapes = {
  SINGLE_SHOT: 'SINGLE_SHOT',
  TRI_SHOT: 'TRI_SHOT',
  CHAIN_SHOT: 'CHAIN_SHOT',
  SPRAY_SHOT: 'SPRAY_SHOT',
  RAIN: 'RAIN',
};
