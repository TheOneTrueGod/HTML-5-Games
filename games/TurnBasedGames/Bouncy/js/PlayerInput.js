class PlayerInput {
  constructor() {
    this.selectedAbility = null;
    this.selectedUnit = null;
  }

  getSelectedAbility() { return this.selectedAbility; }

  setSelectedAbility(abilityID) {
    if (abilityID === undefined) {
      throw new Error("Can't set an undefined ability");
    }
    if (abilityID === null || AbilityDef.abilityDefList[abilityID].canBeUsed()) {
      this.selectedAbility = abilityID;
    }
  }

  selectUnit(unit) {
    if (unit && !unit.canSelect()) { return; }
    if (this.selectedUnit) {
      this.selectedUnit.setSelected(false);
    }
    this.selectedUnit = unit;
    if (this.selectedUnit) {
      this.selectedUnit.setSelected(true);
    }
  }

  handleClick(target, event) {
    if (
      this.selectedAbility &&
      event.button == 0
    ) {
      MainGame.setAimPreview(null, null, null);
      MainGame.setPlayerCommand(
        new PlayerCommandUseAbility(
          event.offsetX,
          event.offsetY,
          this.selectedAbility
        )
      );

      this.setSelectedAbility(null);
      UIListeners.updateSelectedAbility();
    }
  }

  handleMouseMotion(event) {
    if (this.selectedAbility) {
      MainGame.setAimPreview(
        event.offsetX, event.offsetY,
        this.selectedAbility
      );
    }
  }

  findClickedUnit(clickX, clickY) {
    var selected = null;
    for (var i = 0; i < MainGame.boardState.units.length; i++) {
      var unit = MainGame.boardState.units[i];
      var distSquared = (unit.x - clickX) ** 2 + (unit.y - clickY) ** 2;
      if (unit.canSelect() && distSquared < unit.getSelectionRadius() ** 2) {
        selected = unit;
      }
    }
    return selected;
  }
}

PlayerInput = new PlayerInput();
