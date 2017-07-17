<?php
require_once('server/GameObject.php');
class NewGameController {
  public static $GAME_TYPE_CARDS_N_MAGIC = "cardsNMagic";
  public static $GAME_TYPE_BOUNCY = "bouncy";
  public static function getURLPath($gameType = null) {
    $toRet = '/new_game';
    if (!$gameType) {
      $toRet .= '/[:gameType]';
    } else {
      $toRet .= "/" . $gameType;
    }

    return $toRet;
  }

  private function createNewGame($request) {
    $game_id = DatastoreFactory::getDatastore()->getNewGameID();
    $gameType = $request->gameType;
    if ($game_id == null || $gameType == null) { return null; }
    switch ($gameType) {
      case self::$GAME_TYPE_BOUNCY:
        $gameObj = new BouncyGameObject($game_id, "Created Bouncy Game");
        break;
      case self::$GAME_TYPE_CARDS_N_MAGIC:
      default:
        $gameObj = new CardsNMagicGameObject($game_id, "Created Cards n Magic Game");
        break;
    }

    $gameObj->save();
    $gameObj->savePlayerData();
    return $gameObj;
  }

  function getResponse($request) {
    $gameObj = $this->createNewGame($request);
    if (!$gameObj) {
      throw new Exception("Too Many Games Created");
      return;
    }
    header("Location: " . GameController::buildURL($gameObj->getID()));
    die();
  }
}
