<?php
require_once('server/datastore/DatastoreFactory.php');
require_once('CardsNMagic/CardsNMagicGameObject.php');
abstract class GameObject {
  private $id;
  private $turn_id;
  private $name;
  function __construct($id, $name, $turn_id = 1) {
    $this->id = $id;
    $this->turn_id = $turn_id;
    $this->name = $name;
  }

  public function getID() { return $this->id; }
  public function getCurrentTurn() { return $this->turn_id; }
  public function setCurrentTurn($turn) { $this->turn_id = $turn; }
  public function getName() { return $this->name; }
  public abstract static function getGameTypeID();

  public function save() {
    DatastoreFactory::getDatastore()->saveGameObjectJSON($this);
  }

  public function getJSON() {
    return json_encode([
      'id' => $this->getID(),
      'turn_id' => $this->getCurrentTurn(),
      'name' => $this->getName(),
      'game_type_id' => $this::getGameTypeID(),
      'game_data' => $this->getSerializableData()
    ]);
  }

  protected abstract function getSerializableData();

  public static function loadFromJSON($json) {
    $decoded = json_decode($json);
    $game_type = $decoded->game_type_id;
    switch ($game_type) {
      case CardsNMagicGameObject::getGameTypeID();
        $go = new CardsNMagicGameObject(
          $decoded->id,
          $decoded->name,
          $decoded->turn_id,
          $decoded->game_data
        );
      break;
    }
    if (!$go) {
      throw new Exception("Couldn't identify json ({$json})\n\n");
    }
    return $go;
  }

  public static function loadFromFile($game_id, $turn_id = -1) {
    $json = DatastoreFactory::getDatastore()->getGameObjectJSON(
      $game_id,
      $turn_id
    );
    return self::loadFromJSON($json);
  }
}
