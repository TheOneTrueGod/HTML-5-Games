class UIListeners {
  contructor() {
    this.otherDecks = [];
    this.deliberatelyQuit = false;
  }

  createPlayerStatus(players) {
    for (var key in players) {
      var player = players[key];
      var playerControls =
        "<div " +
          "class='playerStatus " + player.getUserID() + "'" +
          "player-index=" + player.player_index +
        ">" +
        "<div class='statusIndicator'></div>" +
        "<div class='playerName'>" + player.getUserName() + "</div>"
        "</div>";
      $('#missionControlsDisplay .playerStatusContainer').append(playerControls);
    }
  }

  updatePlayerStatus(boardState, players) {
    var turnOrder = boardState.getTurnOrder(players);
    for (var i = 0; i < turnOrder.length; i++) {
      var status = $('.playerStatus[player-index=' + turnOrder[i] + ']');
      //status.remove();
      $('#missionControlsDisplay .playerStatusContainer').append(status);
      //$("#container .row:first").remove().insertAfter($("#container .row:last));
      /*while (status.next()) {
        status.insertAfter(status.next());
      }*/
      /*var parent = status.parent();
      parent.removeChild(status);
      parent.append(status);*/
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
      abilities[i].chargeUpdated();
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

    $('#missionActionDisplay').on('mousemove', function(event) {
      PlayerInput.handleMouseMotion(event);
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

  updateTeamHealth(currHealth, maxHealth) {
    let healthPct = currHealth / maxHealth;
    var pct = healthPct * 100;
    $('.healthbar_progress').css('width', pct + '%');
    $('.healthbar_text').text(currHealth);

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

    $('.isHost .difficultySelect .button').on('click', (event) => {
      $('.difficultySelect .button.selected').removeClass('selected');
      $(event.target).addClass('selected');
    });

    $('.isHost .levelSelect .level').on('click', (event) => {
      let $target = $(event.target);
      if ($target.hasClass('disabled')) {
        return;
      }
      $('.levelSelect .level.selected').removeClass('selected');
      $target.addClass('selected');

      console.log($target.data('level'));
      ServerCalls.UpdatePreGameState(
        null,
        ServerCalls.SLOT_ACTIONS.SET_LEVEL,
        null,
        null,
        $target.data('level')
      );
    });

    for (var i = 0; i < 4; i++) {
      var player = players[i];
      var $section = $("#playerSetupBoard .playerSetupSection[data-playerIndex=" + i + "]");
      if (player) {
        $section.addClass("hasPlayer").removeClass('noPlayer');
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
            .text(player.getAbilityDeckName());
        } else {
          $section.find(".quitButton").hide();
          $section.find(".abilityDeckName").text(player.getAbilityDeckName());
        }
      } else {
        $section.removeClass("hasPlayer").addClass("noPlayer");
        $section.find(".noPlayerSection").show();
      }
    }

    var alreadyInGame = false;
    for (i = 0; i < 4; i++) {
      if (players[i] && players[i].getUserID() == loggedInPlayerID) {
        alreadyInGame = true;
      }
    }

    if (alreadyInGame) {
      $(".joinGameButton").hide();
    } else if (!this.deliberatelyQuit) {
      $(".joinGameButton").show();
      $(".noPlayer .joinGameButton").first().click();
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
    this.deliberatelyQuit = true;
    var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
    $(".joinGameButton").show();
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
    this.deliberatelyQuit = false;
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
