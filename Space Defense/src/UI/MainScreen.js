class MainScreen extends Screen {
  init() {
    var selectedShip = 'interceptors';

    this.gameScreen = this.addChildScreen("game", (new GameScreen()).init())
      .addListener("button_click", (event) => {
        switch (event.button_name) {
          case "next_level":
            this.pbbs.loadNextMission();
            this.showScreen("main_menu");
            break;
            // NO BREAK
          case "retry_level":
            this.pbbs.reloadMission();
            this.showScreen("main_menu");
            break;
        }
      });
    this.pbbs = this.addChildScreen("main_menu", (new PointBuyBattleScreen())
      .init())
      .addListener("button_click", (event) => {
        switch (event.button_name) {

        }
      })
      .addListener("game_start", (event) => {
        this.gameScreen.resetGameState();
        Game.reset(event.shipDefList);
        this.showScreen("game");
      });

    this.showScreen("main_menu");
    return this;
  }
}
