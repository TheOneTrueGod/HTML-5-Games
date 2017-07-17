class ServerCalls {
  constructor() {
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.userToken = getUrlParameter('userToken');
  }

  MakeServerCall(callback, command, context) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: command,
        userToken: this.userToken,
      },
      success: function( result ) {
        result = $.parseJSON(result);
        if (result['success']) {
          callback.call(context, result['response']);
        }
      }
    });
  }

  LoadInitialBoard(callback, context) {
    this.MakeServerCall(
      callback,
      ServerCalls.SERVER_ACTIONS.GET_BOARD_DATA,
      context
    );
  }

  LoadGameMetaData(callback, context) {
    this.MakeServerCall(
      callback,
      ServerCalls.SERVER_ACTIONS.GET_GAME_METADATA,
      context
    );
  }

  GetTurnStatus(callback, context) {
    this.MakeServerCall(
      callback,
      ServerCalls.SERVER_ACTIONS.GET_TURN_STATUS,
      context
    );
  }

  SetupBoardAtGameStart(boardStateObj, context) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SET_BOARD_AT_TURN_START,
        board_state: JSON.stringify(boardStateObj.serializeBoardState()),
        turn: 1,
        userToken: this.userToken,
      },
    });
  };

  SetBoardStateAtStartOfTurn(boardStateObj, context) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SET_BOARD_AT_TURN_START,
        board_state: JSON.stringify(boardStateObj.serializeBoardState()),
        turn: boardStateObj.turn,
        userToken: this.userToken,
      },
    });
  };

  FinalizeTurn(context, callback) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.FINALIZE_TURN,
        userToken: this.userToken
      },
    }).done(function(data) {
      if (!data) {
        throw new Exception("Error Finalizing tern on server");
        return;
      }
      var parsedData = $.parseJSON(data);
      if (parsedData['error']) {
        alert(parsedData['error_message']);
        return;
      }
      if (parsedData['success']) {
        MainGame.deserializePlayerCommands(
          $.parseJSON(parsedData['response'])
        );
      }

      callback.call(context, data);
    });
  }

  SavePlayerCommands(boardStateObj, playerCommands) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SUBMIT_PLAYER_COMMANDS,
        turn: boardStateObj.turn,
        userToken: this.userToken,
        playerCommands: playerCommands
      },
    });
  }
}

ServerCalls.SERVER_ACTIONS = {
  GET_BOARD_DATA: 'get_board_data',
  SET_BOARD_AT_TURN_START: 'set_board_at_turn_start',
  FINALIZE_TURN: 'finalize_turn',
  SUBMIT_PLAYER_COMMANDS: 'submit_player_commands',
  GET_TURN_STATUS: 'get_turn_status',
  GET_GAME_METADATA: 'get_game_metadata',
}

ServerCalls = new ServerCalls();
