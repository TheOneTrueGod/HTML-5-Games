class UIListeners {
  contructor() {

  }

  setupUIListeners() {
    $('#missionEndTurnButton').on('click', function() {
      MainGame.finalizeTurn();
    });

    var self = this;

    $('#missionProgramDisplay .abilityCard').on(
      'click',
      function() {
        // Deselect currently selected abilities
        PlayerInput.setSelectedAbility($(this).attr("ability-id"));
        self.updateSelectedAbility();
      }
    );
    
    $('#missionActionDisplay').on('click', function(event) {
      PlayerInput.handleClick(this, event);
    });
  }

  updateSelectedAbility() {
    $('.abilityCard.selected').removeClass('selected');
    if (PlayerInput.getSelectedAbility()) {
      $('.abilityCard[ability-id=' + PlayerInput.getSelectedAbility() + ']')
        .addClass("selected");
    }
  }
}

UIListeners = new UIListeners();
