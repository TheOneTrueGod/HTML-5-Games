<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once('server/GameSelectController.php');
require_once('server/NewGameController.php');
require_once('server/GameController.php');
require_once('server/User.php');
require_once('server/GameLogicController.php');
require_once('server/KleinUtils.php');

$klein = new \Klein\Klein();

KleinUtils::addHTMLResponder($klein, GameSelectController, 'GET', '/');
KleinUtils::addHTMLResponder($klein, GameSelectController);
KleinUtils::addHTMLResponder($klein, NewGameController, 'GET');
KleinUtils::addHTMLResponder($klein, GameController, 'GET');
KleinUtils::addLogicResponder($klein, GameLogicController);

$klein->onHttpError(function ($code, $router) {
  switch ($code) {
    case 404:
      $router->response()->body('Y U so lost?!');
      break;
    case 405:
      $router->response()->body('You can\'t do that!');
      break;
    default:
      $router->response()->body(
          'Oh no, a bad error happened that caused a '. $code
      );
  }
});

$klein->dispatch();
?>
