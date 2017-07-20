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

    var playerID = $('#gameContainer').attr('playerid');
    var player;
    for (var key in players) {
      if (players[key].getUserID() === playerID) {
        player = players[key];
      }
    }
    if (!player) {
      throw new Error("PlayerID [" + playerID + "] not in Players");
    }

    var $div; var $ability;

    var abilities = player.getAbilities();
    for (var i = 0; i < abilities.length; i++) {
      $div = $("<div>", {"class": "abilityContainer"});
      $div.append(abilities[i].getAbilityHTML());
      $('#missionProgramDisplay').append($div);
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
    $('.healthbar_progress').css('width', pct + '%');
  }

  showGameOverScreen(playersWon) {
    $('#gameContainer').addClass("gameOver");
    if (playersWon) {
      $('#warningMessageBox').text("A winner is you!");
    } else {
      $('#warningMessageBox').text("Game Over");
    }

    $('#warningMessageBox').show();
  }

  updateGameProgress(progressPct) {
    var pct = progressPct * 100;
    $('.timeline_progress').css('width', pct + '%');
  }

}

UIListeners = new UIListeners();
