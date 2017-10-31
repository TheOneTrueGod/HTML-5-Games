class ProjectileAccuracy {
  constructor(accuracyJSON) {
    if (!accuracyJSON) {
      this.minRadius = 0;
      this.maxRadius = 0;
      
      this.minDist = 0;
      this.maxDist = 10000;
      return;
    }
    this.minRadius = idx(accuracyJSON, 'min_radius', 50);
    this.maxRadius = idx(accuracyJSON, 'max_radius', 100);
    this.minDist = idx(accuracyJSON, 'min_dist', 50);
    this.maxDist = idx(accuracyJSON, 'max_dist', 400);
  }
  
  isAccuracyDefined() {
    return this.minRadius != 0 && this.maxRadius != 0;
  }
  
  getCircleRadius(aimDistance) {
    return lerp(
      this.minRadius, 
      this.maxRadius, 
      Math.max(Math.min((aimDistance - this.minDist) / (this.maxDist - this.minDist), 1), 0)
    );
  }
  
  getRandomTarget(boardState, castPoint, targetPoint) {
    if (!this.isAccuracyDefined()) {
      return targetPoint;
    }
    
    let dist = Math.pow(distSqr(castPoint, targetPoint), 0.5);
    let r = this.getCircleRadius(dist);
    
    r = Math.pow(boardState.getRandom() * Math.pow(r, 2), 0.5);
    let angle = boardState.getRandom() * Math.PI * 2;
    
    return {
      x: targetPoint.x + r * Math.cos(angle), 
      y: targetPoint.y + r * Math.sin(angle),
    };
  }
}

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

    this.accuracy = new ProjectileAccuracy(defJSON.accuracy);
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
  
  getAccuracy() {
    return this.accuracy;
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

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    super.doActionOnTick(playerID, tick, boardState, castPoint, targetPoint);
    this.shape.doActionOnTick(playerID, tick, boardState, castPoint, targetPoint);
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
      abilDefCardDescription = this.replaceSmartTooltipText(abilDefCardDescription, false);
      var className = "textDescText";

      /*if (abilDefCardDescription.length >= 10) {
        className += " longDesc";
      }*/
      var $textContainer =
        $("<div>", {
          "class": className,
        });
      $textContainer.html(abilDefCardDescription);

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
      let circleSize = 8;
      const innerCircleSize = 3;
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
      var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      if (this.accuracy.isAccuracyDefined()) {
        const maxDist = this.accuracy.maxDist;
        const minDist = this.accuracy.minDist;
        dist = Math.min(dist, maxDist);
        circleSize = this.accuracy.getCircleRadius(dist);
      }
      
      let circleCenter = {
        x: startPos.x + Math.cos(angle) * dist,
        y: startPos.y + Math.sin(angle) * dist
      };
      dist -= circleSize;
      lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y)
        .lineTo(
          startPos.x + Math.cos(angle) * dist,
          startPos.y + Math.sin(angle) * dist
        );

      lineGraphic.drawCircle(circleCenter.x, circleCenter.y, circleSize);

      lineGraphic.beginFill(color);
      lineGraphic.drawCircle(circleCenter.x, circleCenter.y, innerCircleSize);

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
  WAVE: 'WAVE',
};
