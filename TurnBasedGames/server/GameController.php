<?php
class GameController {
  public static function getURLPath() {
    return "/game/[:id]";
  }

  public static function buildURL($id) {
    return "/game/" . $id;
  }

  function getResponse($request) {
    $game = GameObject::loadFromFile($request->id);
    $controller = $game::getController();
    return $controller->getResponse(
      $request,
      $game,
      User::getFromToken($request->param('userToken'))
    );
  }
}
