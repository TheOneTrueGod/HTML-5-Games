class UIListeners {
  contructor() {

  }

  createPlayerStatus(players) {
    for (var key in players) {
      var player = players[key];
      var playerControls = "<div class='playerStatus " + player.getUserID() + "'>" +
        "<div class='statusIndicator'></div>" +
        "<div class='playerName'>" + player.getUserName() + "</div>"
        "</div>";
      $('#missionControlsDisplay .playerStatusContainer').append(playerControls);
    }
  }

  createAbilityDisplay(players) {
    $('#missionProgramDisplay').append(
      $("<div>", {"class": "missionProgramDisplayLockOverlay"})
    );

    var $div; var $ability;
    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {
      "class": "abilityCard tempFirstAbil",
      "ability-id": 1,
    });
    $div.append($ability);
    $('#missionProgramDisplay').append($div);

    $div = $("<div>", {"class": "abilityContainer"});
    $ability = $("<div>", {
      "class": "abilityCard tempSecondAbil",
      "ability-id": 2,
    });
    $div.append($ability);
    $('#missionProgramDisplay').append($div);
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

  updatePlayerCommands(player_commands, players) {
    $('.playerStatus.statusIndicator').removeClass('ready');
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (player_commands[player.getUserID()] !== undefined) {
        $('.playerStatus.' + player.getUserID() + ' .statusIndicator').addClass('ready');
      }
    }
  }

  updateTeamHealth(healthPct) {
    var pct = healthPct * 100;
    $('.timeline_progress').css('width', pct + '%');
    if (pct <= 0) {
      $('#gameContainer').addClass("gameOver");
      $('#warningMessageBox').text("Game Over");
      $('#warningMessageBox').show();
    }
  }

}

UIListeners = new UIListeners();
