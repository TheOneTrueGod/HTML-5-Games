<?php
require_once('server/GameObject.php');
class NewGameController {
  public static function getURLPath() {
    return '/new_game';
  }

  private function createNewGame() {
    $game_id = DatastoreFactory::getDatastore()->getNewGameID();
    if ($game_id == null) { return null; }
    $gameObj = new CardsNMagicGameObject($game_id, "Created Game");
    $gameObj->save();
    return $gameObj;
  }

  function getResponse($request) {
    $gameObj = $this->createNewGame();
    if (!$gameObj) {
      throw new Exception("Too Many Games Created");
      return;
    }
    header("Location: " . GameController::buildURL($gameObj->getID()));
    die();
  }
}
