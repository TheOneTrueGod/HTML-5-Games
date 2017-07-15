class UIListeners {
  contructor() {

  }

  createPlayerStatus() {
    for (var i = 0; i < 4; i++) {
      var playerControls = "<div class='playerStatus player" + i + "'>" +
        "<div class='statusIndicator'></div>" +
          "Player " + i +
        "</div>";
      $('#missionControlsDisplay .playerStatusContainer').append(playerControls);
    }
  }

  setupUIListeners() {
    $('#missionEndTurnButton').on('click', function() {
      TurnControls.setPlayState(false);
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

    $('#missionActionDisplay').on('contextmenu', function(event) {
      PlayerInput.handleClick(this, event);
      event.preventDefault();
      return false;
    });
  }

  updateSelectedAbility() {
    $('.abilityCard.selected').removeClass('selected');
    if (PlayerInput.getSelectedAbility()) {
      $('.abilityCard[ability-id=' + PlayerInput.getSelectedAbility() + ']')
        .addClass("selected");
    }
  }

  updatePlayerCommands(player_commands) {
    for (var i = 0; i < 4; i++) {
      if (player_commands[i] !== undefined) {
        $('.playerStatus.player' + i + ' .statusIndicator').addClass('ready');
      } else {
        $('.playerStatus.player' + i + ' .statusIndicator').removeClass('ready');
      }
    }
  }

}

UIListeners = new UIListeners();
