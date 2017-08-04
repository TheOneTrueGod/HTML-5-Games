class UIListeners {
  contructor() {
    this.otherDecks = [];
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
    $('.playerStatus .statusIndicator').removeClass('ready');
    for (var key in players) {
      var player = players[key];
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

  updateGameSetupScreen(players) {
    var loggedInPlayerID = $('#gameContainer').attr('playerID');
    $('.screen').hide();
    $('#playerSetupBoard').show();
    $("#playerSetupBoard .noPlayerSection").hide();
    $("#playerSetupBoard .playerSection").hide();

    var alreadyInGame = false;
    for (var i = 0; i < 4; i++) {
      if (players[i] && players[i].getUserID() == loggedInPlayerID) {
        alreadyInGame = true;
      }
    }

    if (alreadyInGame) {
      $(".joinGameButton").hide();
    } else {
      $(".joinGameButton").show();
    }

    for (var i = 0; i < 4; i++) {
      var player = players[i];
      var $section = $("#playerSetupBoard [data-playerIndex=" + i + "]");
      if (player) {
        $section.find(".playerSection").show();
        $section.find(".playerNameDisplay").text(player.getUserName());
        $section.find(".startButton").hide();
        $section.find(".abilityDeckName").off();
        if (player.getUserID() == loggedInPlayerID) {
          $section.find(".quitButton").show();
          if (player.getUserID() == "totg") {
            $section.find(".startButton").show();
          }
          $section.find(".abilityDeckName")
            .on("click", this.switchDeckClick.bind(this, i, player))
            .find("div")
            .text(player.getAbilityDeckName());
        } else {
          $section.find(".quitButton").hide();
          $section.find(".abilityDeckName").find("div").text(player.getAbilityDeckName());
        }
      } else {
        $section.find(".noPlayerSection").show();
      }
    }
  }

  startClick(playerID, event) {
    var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
    $section.find(".startButton").hide();
    $section.find(".quitButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.START,
      GameInitializer.handleMetaDataLoaded,
      GameInitializer
    );
  }

  quitClick(playerID, event) {
    var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
    $section.find(".startButton").hide();
    $section.find(".quitButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.QUIT,
      GameInitializer.handleMetaDataLoaded,
      GameInitializer
    );
  }

  joinGameClick(playerID, event) {
    $(".joinGameButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.JOIN,
      GameInitializer.handleMetaDataLoaded,
      GameInitializer
    );
  }

  setOtherDecks(otherDeckData) {
    this.otherDecks = [];
    for (var deck in otherDeckData) {
      this.otherDecks.push(new PlayerDeck(otherDeckData[deck]));
    }
  }

  switchDeckClick(player_slot, player, event) {
    var currDeckID = player.getAbilityDeckID();
    var nextDeckIndex = -1;
    for (var i = 0; i < this.otherDecks.length; i++) {
      if (this.otherDecks[i].getID() == currDeckID) {
        nextDeckIndex = (i + 1) % this.otherDecks.length;
      }
    }

    if (nextDeckIndex == -1) { throw new Exception("couldn't find current deck in deck list"); }

    ServerCalls.UpdatePreGameState(
      player_slot,
      ServerCalls.SLOT_ACTIONS.CHANGE_DECK,
      GameInitializer.handleMetaDataLoaded,
      GameInitializer,
      this.otherDecks[nextDeckIndex].getID()
    );
  }

  setupPlayerInitListeners() {
    for (var i = 0; i < 4; i++) {
      var playerID = i;
      var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
      $section.find(".startButton").on("click", this.startClick.bind(this, playerID));
      $section.find(".quitButton").on("click", this.quitClick.bind(this, playerID));
      $section.find(".joinGameButton").on("click", this.joinGameClick.bind(this, playerID));
    }
  }

  showGameBoard() {
    $('.screen').hide();
    $('#gameBoard').show();
  }
}

UIListeners = new UIListeners();