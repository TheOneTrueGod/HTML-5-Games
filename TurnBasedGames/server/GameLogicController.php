<?php
class GameLogicController {
  public static function getURLPath() {
    return "/gamelogic/[:id]";
  }

  public static function buildURL($id) {
    return "/gamelogic/" . $id;
  }

  function getResponse($request) {
    $game = GameObject::loadFromFile($request->id);
    $controller = $game::getController();
    $userToken = $request->param('userToken');
    return $controller->getResponse(
      $request,
      $game,
      User::getFromToken($userToken)
    );
  }
}
