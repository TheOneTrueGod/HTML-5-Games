class PlayerInput {
  constructor() {
    this.selectedAbility = null;
    this.selectedUnit = null;
  }

  getSelectedAbility() { return this.selectedAbility; }

  setSelectedAbility(abilityID) {
    if (abilityID === undefined) {
      throw new Exception("Can't set an undefined ability");
    }
    this.selectedAbility = abilityID;
  }

  handleClick(target, event) {
    if (
      this.selectedAbility &&
      event.button == 0
    ) {
      this.setSelectedAbility(null);
      UIListeners.updateSelectedAbility();

      MainGame.addPlayerCommand(
        new PlayerCommand(
          event.offsetX,
          event.offsetY,
          this.selectedAbility
        )
      );
    }

    if (!this.selectedAbility) {
      if (event.button == 0) {
        this.selectedUnit = this.findClickedUnit(event.offsetX, event.offsetY);
      } else if (event.button == 2) {
        if (this.selectedUnit) {
          MainGame.addPlayerCommand(
            new PlayerCommandMoveUnit(
              event.offsetX, event.offsetY,
              this.selectedUnit.id
            )
          );
        }
      }
    }
  }

  findClickedUnit(clickX, clickY) {
    var selected = null;
    for (var i = 0; i < MainGame.boardState.units.length; i++) {
      var unit = MainGame.boardState.units[i];
      var distSquared = (unit.x - clickX) ** 2 + (unit.y - clickY) ** 2;
      if (distSquared < unit.getSelectionRadius() ** 2) {
        selected = unit;
      }
    }
    return selected;
  }
}

PlayerInput = new PlayerInput();
