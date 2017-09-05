class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    if (!defJSON['shape'] || !defJSON['projectile_type']) {
      throw new Error("shape and projectile_type are required in a ProjectileAbilityDef");
    }

    this.shapeType = defJSON['shape'];
    this.projectileType = defJSON['projectile_type'];
    this.hitEffects = defJSON['hit_effects'] ? defJSON['hit_effects'] : [];
    this.timeoutEffects = defJSON['timeout_effects'] ? defJSON['timeout_effects'] : [];
    this.rawDef = defJSON;

    this.shape = ProjectileShape.getProjectileShape(defJSON['shape'], this);

    if (defJSON.timeout_effects) {
      this.loadNestedAbilityDefs(defJSON.timeout_effects);
    }

    for (var i = 0; i < defJSON.hit_effects.length; i++) {
      if (defJSON.hit_effects[i].effect == ProjectileShape.HitEffects.INFECT) {
        this.loadNestedAbilityDefs([defJSON.hit_effects[i]]);
      }
    }
  }

  getHitEffects() {
    return this.hitEffects;
  }

  getTimeoutEffects() {
    return this.timeoutEffects;
  }

  getProjectileType() {
    return this.projectileType;
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

    $card.append(this.getTextDescription());

    return $card;
  }

  getTextDescription() {
    var $textDesc = $("<div>", {"class": "abilityCardTextDesc"});

    var abilDefCardDescription = this.getOptionalParam('card_text_description');
    if (abilDefCardDescription) {
      var $textContainer =
        $("<div>", {
          "class": "textDescText",
        });
      $textContainer.html(this.replaceSmartTooltipText(abilDefCardDescription));

      $textDesc.append($textContainer);
    } else {
      this.shape.appendTextDescHTML($textDesc);
    }

    return $textDesc;
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
  BULLET_EXPLOSION: 'BULLET_EXPLOSION',
  WAVE: 'WAVE'
};
