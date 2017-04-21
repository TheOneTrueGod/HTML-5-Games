class GameControls {
  constructor(game, team) {
    this.selectedShips = [];

    this.team = 0;
    this.mouseDownPos = null;
    this.currMousePos = [0, 0];
    this.shipDownOn = null;
    this.shipUpOn = null;

    game.addListener('ship_mouse_down', (event) => {
      this.shipDownOn = event.ship;
    });
    game.addListener('ship_mouse_up', (event) => {
      if (this.shipDownOn == event.ship) {
        this.selectShip(event.ship);
      }
      this.shipUpOn = event.ship;
    });
    game.addListener('game_mouse_down', (event) => {
      this.mouseDownPos = [
        event.event.data.originalEvent.offsetX,
        event.event.data.originalEvent.offsetY
      ];
    });
    game.addListener('game_mouse_up', (event) => {
      if ((!this.shipUpOn || !this.shipDownOn) && this.mouseDownPos) {
        var mouseUpPos = [
          event.event.data.originalEvent.offsetX,
          event.event.data.originalEvent.offsetY
        ];
        if (
          Math.abs(mouseUpPos[0] - this.mouseDownPos[0]) < 10 &&
          Math.abs(mouseUpPos[1] - this.mouseDownPos[1]) < 10
        ) {
          this.sendOrderToSelectedShips(new AIMovementOrder(this.mouseDownPos[0], this.mouseDownPos[1]));
        } else {
          this.deselectAllShips();
          this.selectYourShipsInSquare(this.mouseDownPos, mouseUpPos);
        }
      }
      this.mouseDownPos = null;
      this.shipDownOn = null;
      this.shipUpOn = null;
    });

    game.addListener('game_mouse_motion', (event) => {
      this.currMousePos = [
        event.event.data.originalEvent.offsetX,
        event.event.data.originalEvent.offsetY
      ];
    });
  }

  selectYourShipsInSquare(mPos0, mPos1) {
    var topLeft = [Math.min(mPos0[0], mPos1[0]), Math.min(mPos0[1], mPos1[1])];
    var botRight = [Math.max(mPos0[0], mPos1[0]), Math.max(mPos0[1], mPos1[1])];
    var yourShips = Game.getShipsOnTeam(this.team);
    for (var i = 0; i < yourShips.length; i++) {
      var ship = yourShips[i];
      if (
        topLeft[0] <= ship.position.x &&
        ship.position.x <= botRight[0] &&
        topLeft[1] <= ship.position.y &&
        ship.position.y <= botRight[1]
      ) {
        this.selectedShips[ship.id] = ship;
        ship.select(true);
      }
    }
  }

  sendOrderToSelectedShips(order) {
    for (var id in this.selectedShips) {
      var ship = this.selectedShips[id];
      ship.AI.giveOrder(order);
    }
  }

  selectShip(ship) {
    if (ship.team == this.team) {
      this.deselectAllShips();

      this.selectedShips[ship.id] = ship;
      ship.select(true);
    } else {
      this.selectedShips.forEach((selectedShip) => {
        selectedShip.setTarget(ship);
      });
    }
  }

  deselectAllShips() {
    for (var key in this.selectedShips) {
      this.selectedShips[key].select(false);
    }
    this.selectedShips = [];
  }
}
