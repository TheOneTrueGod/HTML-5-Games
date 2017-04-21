class UIListeners {

}

UIListeners.setupUIListeners = function() {
  $('#missionEndTurnButton').on('click', function() {
    MainGame.finalizeTurn();
  });
}
