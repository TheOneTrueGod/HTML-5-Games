function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
}








class MainGame {
  constructor() {
    this.ticksPerTurn = 20;
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
    this.playerID = $('#gameContainer').attr('playerID');

    //Create the renderer
    var mad = $('#missionActionDisplay');
    this.renderer = PIXI.autoDetectRenderer(mad.width(), mad.height());
    this.stage = new PIXI.Container();

    //Add the canvas to the HTML document
    mad.append(this.renderer.view);

    this.playerCommands = [];
  }

  addLineFromTo(x1, y1, x2, y2) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    this.stage.addChild(lineGraphic);

    // Move it to the beginning of the line
    lineGraphic.position.set(x1, y1);

    // Draw the line (endPoint should be relative to myGraph's position)
    lineGraphic.lineStyle(2, 0xffffff)
           .moveTo(0, 0)
           .lineTo(x2 - x1, y2 - y1);
    return lineGraphic;
  }

  findIntersectPoint(x1, y1, x2, y2, lines) {
    var closest = null;
    for (var i = 0; i < lines.length; i++) {
      var l2 = lines[i];
      var intersectionPoint = checkLineIntersection(
        x2, y2, x1, y1,
        l2[0], l2[1], l2[2], l2[3]
      );
      if (intersectionPoint &&
        intersectionPoint.onLine1 && intersectionPoint.onLine2
      ) {
        if (!closest) {
          closest = {x: intersectionPoint.x, y: intersectionPoint.y};
        } else {
          var closestDist = Math.pow(x1 - closest.x, 2) + Math.pow(y1 - closest.y, 2);
          var newDist = Math.pow(x1 - intersectionPoint.x, 2) + Math.pow(x2 - intersectionPoint, 2);
          if (newDist < closestDist) {
            closest = {x: intersectionPoint.x, y: intersectionPoint.y};
          }
        }
      }
    }
    return closest;
  }

  testRefraction(x1, y1, angle, distance, lines) {
    var returnLines = [];
    var x2 = x1 + Math.cos(angle) * distance;
    var y2 = y1 + Math.sin(angle) * distance;
    var intersection = this.findIntersectPoint(x1, y1, x2, y2, lines);
    if (intersection) {
      returnLines.push(this.addLineFromTo(
        x1, y1,
        intersection.x, intersection.y
      ));
    } else {
      returnLines.push(this.addLineFromTo(
        x1, y1,
        x2, y2
      ));
    }

    return returnLines;
  }

  runLineTester() {
    var lines = [
      [40, 20, 240, 20],
      [260, 40, 260, 240],
      [20, 40, 20, 240]
    ];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      this.addLineFromTo(line[0], line[1], line[2], line[3]);
      this.forceRedraw();
    }

    this.testRefraction(200, 300, Math.PI * 5 / 4.0, 400, lines);

    this.forceRedraw();
  }

  startGameLoading() {
    var self = this;

    GameInitializer.setHostNewGameCallback(function() {
      self.boardState = new BoardState(self.stage);
      self.boardState.addInitialPlayers(4);
      ServerCalls.SetupBoardAtGameStart(self.boardState, self);
    })
    .setLoadCompleteCallback(this.gameReadyToBegin.bind(this))
    .setLoadServerDataCallback(this.deserializeGameData.bind(this));

    var imageLoadCallback = function() {
      GameInitializer.start();
    };
    PIXI.loader
      .add("byte", "/CardsNMagic/assets/byte.png")
      .add("byte_red", "/CardsNMagic/assets/byte_red.png")
      .add("core", "/CardsNMagic/assets/core.png")
      .load(imageLoadCallback);
  }

  // Step 3 -- deserialize the board state from the server
  deserializeGameData(gameData) {
    var serverBoardState = JSON.parse(gameData.board_state);

    this.boardState = new BoardState(
      this.stage,
      serverBoardState
    );

    this.boardState.loadUnits(serverBoardState.units);

    var player_command_list = JSON.parse(gameData.player_commands);
    this.deserializePlayerCommands(player_command_list);
  }

  deserializePlayerCommands(player_command_list) {
    var self = this;
    for (var player_id in player_command_list) {
      if (player_command_list.hasOwnProperty(player_id)) {
        var command_list = player_command_list[player_id];
        command_list.forEach(function(commandJSON) {
          self.setPlayerCommand(
            PlayerCommand.FromServerData(commandJSON),
            false
          );
        });
      }
    }
  }

  gameReadyToBegin() {
    this.boardState.saveState();

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

    UIListeners.setupUIListeners();
    this.renderer.render(this.stage);
  }

  finalizeTurn() {
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true);
    ServerCalls.FinalizeTurn(this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    // Play Turn Out
    this.forcePlayTurn(this.finalizedTurnOver);
  }

  forcePlayTurn(finishedCallback) {
    this.doTick(function() {
      window.setTimeout(this.forcePlayTurn.bind(this, finishedCallback), 20);
    }, finishedCallback);
  }

  doTick(tickOverCallback, finishedCallback) {
    AIDirector.runTick();
    this.boardState.runTick(this.playerCommands);
    if (this.boardState.atEndOfTurn(this.playerCommands)) {
      finishedCallback.call(this);
    } else {
      tickOverCallback.call(this);
    }
  }

  setPlayerCommand(playerCommand, saveCommand) {
    var pID = playerCommand.getPlayerID();
    if (this.playerCommands[pID] === undefined) {
      this.playerCommands[pID] = [];
    }
    this.playerCommands[pID] = [playerCommand];
    if (
      pID == this.playerID &&
      (saveCommand === true || saveCommand === undefined)
    ) {
      ServerCalls.SavePlayerCommands(
        this.boardState,
        this.playerCommands[pID].map(
          function(playerCommand) {
            return playerCommand.serialize();
          }
        )
      );
    }
  }

  forceRedraw() {
    this.renderer.render(this.stage);
  }

  finalizedTurnOver() {
    $('#missionEndTurnButton').prop("disabled", false);
    this.boardState.incrementTurn();
    this.boardState.saveState();
    ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this);
  }
}

MainGame = new MainGame();

MainGame.runLineTester();
