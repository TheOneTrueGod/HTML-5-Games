<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once('server/GameSelectController.php');
require_once('server/NewGameController.php');
require_once('server/LoginController.php');
require_once('server/GameController.php');
require_once('server/User.php');
require_once('server/GameLogicController.php');
require_once('server/KleinUtils.php');

error_reporting(E_ERROR | E_WARNING | E_PARSE);

session_start();
$klein = new \Klein\Klein();

KleinUtils::addHTMLResponder($klein, LoginController, GameSelectController, 'GET', '/');
KleinUtils::addHTMLResponder($klein, LoginController, GameSelectController, 'POST', '/');
//KleinUtils::addHTMLResponder($klein, LoginController, GameSelectController);
KleinUtils::addHTMLResponder($klein, LoginController, NewGameController, 'GET');
KleinUtils::addHTMLResponder($klein, LoginController, GameController, 'GET');
KleinUtils::addHTMLResponder($klein, LoginController, GameController, 'POST');
KleinUtils::addLogicResponder($klein, LoginController, GameLogicController);
KleinUtils::addLogicResponder($klein, LoginController, GameLogicController, 'POST');
$klein->respond('GET', '/logout', function($request, $response) {
  $_SESSION['user_token'] = null;
  $response->redirect("/");
});

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