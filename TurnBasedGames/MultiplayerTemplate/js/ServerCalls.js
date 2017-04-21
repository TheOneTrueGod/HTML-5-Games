class ServerCalls {
  constructor() {
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.userToken = getUrlParameter('userToken');
  }

  LoadInitialBoard(callback, context) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.GET_BOARD_DATA,
        userToken: this.userToken,
      },
      success: function( result ) {
        callback.call(context, result);
      }
    });
  }

  SetupBoardAtGameStart(boardStateObj, context) {
    $.get({
      url: "/gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SET_BOARD_AT_TURN_START,
        board_state: boardStateObj.serializeBoardState(),
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
        board_state: boardStateObj.serializeBoardState(),
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
        turn: 1,
        userToken: this.userToken
      },
    }).done(function(data) {
      if (!data) {
        throw new Exception("Error Finalizing tern on server");
        return;
      }

      var playerCommands = $.parseJSON(data);
      playerCommands = playerCommands.map(function(pc) {
        // TODO: Convert this to a PlayerCommands object
        return $.parseJSON(pc);
      });

      callback.call(context, data);
    });
  }
}

ServerCalls.SERVER_ACTIONS = {
  GET_BOARD_DATA: 'get_board_data',
  SET_BOARD_AT_TURN_START: 'set_board_at_turn_start',
  FINALIZE_TURN: 'finalize_turn',
}

ServerCalls = new ServerCalls();
