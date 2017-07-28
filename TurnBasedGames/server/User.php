<?php
class User {
  public function __construct($token) {
    $this->token = $token;
    $this->userName = $token;
  }

  public function getUserName() { return $this->userName; }

  public static function getFromToken($token) {
    return new User($token);
  }

  public static function getFromID($id) {
    switch ($id) {
      case 'totg':
        return new User("TheOneTrueGod");
      case 'test2':
        return new User("test2");
      case 'test3':
        return new User("test3");
      case 'test4':
        return new User("test4");
      default:
        return new User("ERROR");
    }
  }

  public function getID() {
    switch ($this->token) {
      case "TheOneTrueGod":
        return 'totg';
      case "test2":
        return 'test2';
      case "test3":
        return 'test3';
      case "test4":
        return 'test4';
      default:
        return 'error';
    }
  }

  public function isHost() {
    return $this->token == "TheOneTrueGod";
  }

  public function isAdmin() {
    return $this->token == "TheOneTrueGod";
  }
}
