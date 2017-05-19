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
    try {
      $response = $controller->getResponse(
        $request,
        $game,
        User::getFromToken($request->param('userToken'))
      );
      return $response;
    } catch (Exception $e) {
      return json_encode(
        ['error' => true, 'error_message' => $e->getMessage()]
      );
    }
  }
}
