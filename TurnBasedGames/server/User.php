<?php
class User {
  public static $all_users;
  public function __construct($id, $username, $password, $token) {
    $this->token = $token;
    $this->userName = $username;
    $this->password = $password;
  }

  public function getID() {
    switch ($this->userName) {
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

  public function getUserName() { return $this->userName; }

  public function isHost() {
    return $this->userName == "TheOneTrueGod";
  }

  public function getToken() {
    return $this->token;
  }

  public function isAdmin() {
    return $this->userName == "TheOneTrueGod";
  }

  public static function getFromToken($token) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if ($user->getToken() == $token) {
        return $user;
      }
    }
    return null;
  }

  public static function getFromUsernamePassword($username, $password) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if (
        ($user->getID() == $username || $user->getUserName() == $username) &&
        $user->getPassword() == $password
      ) {
        return $user;
      }
    }
    return null;
  }

  public static function getFromID($id) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if ($user->getID() == $id) {
        return $user;
      }
    }
    return null;
  }
}

User::$all_users = array(
  new User('totg', "TheOneTrueGod", 'test', 'TheOneTrueGod'),
  new User('test2', "test2", 'test', 'test2'),
  new User('test3', "test3", 'test', 'test3'),
  new User('test4', "test4", 'test', 'test4')
);
