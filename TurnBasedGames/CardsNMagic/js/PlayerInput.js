class PlayerInput {
  constructor() {
    this.selectedAbility = null;
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
      event.button == 1
    ) {
      this.setSelectedAbility(null);
      UIListeners.updateSelectedAbility();
    }
    MainGame.addPlayerCommand(
      new PlayerCommand(
        event.offsetX,
        event.offsetY,
        this.selectedAbility
      )
    );
  }
}

PlayerInput = new PlayerInput();
