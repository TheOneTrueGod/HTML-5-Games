<?php
class User {
  public function __construct($token) {
    $this->token = $token;
  }

  public static function getFromToken($token) {
    return new User($token);
  }

  public static function getFromID($id) {
    switch ($id) {
      case 1:
        return new User("TheOneTrueGod");
      case 2:
        return new User("test");
      default:
        return 3;
    }
  }

  public function getID() {
    switch ($this->token) {
      case "TheOneTrueGod":
        return 1;
      case "test":
        return 2;
      default:
        return 3;
    }
  }

  public function isHost() {
    return $this->token == "TheOneTrueGod";
  }
}
