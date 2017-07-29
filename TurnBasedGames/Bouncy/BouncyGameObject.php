<?php
require_once('server/GameObject.php');
require_once('Bouncy/BouncyController.php');
require_once('Bouncy/server/PlayerDeck.php');
class BouncyGameObject extends GameObject {
  function __construct($id, $name, $turn_id = 1, $game_data, $metadata) {
    GameObject::__construct($id, $name, $turn_id);
    $this->board_state = $game_data->board_state;
    $this->player_commands = $game_data->player_commands ?
      $game_data->player_commands :
      "{}";
    $this->finalized = $game_data->finalized === "true";
    $this->game_over = $game_data->game_over === "true";
    $this->players_won = $game_data->players_won === "true";
    $this->metadata = json_decode($metadata);
  }

  protected function getSerializableData() {
    return [
      'board_state' => $this->board_state,
      'player_commands' => $this->player_commands,
      'finalized' => $this->finalized ? "true" : "false",
      'game_over' => $this->game_over ? "true" : "false",
      'players_won' => $this->players_won ? "true" : "false",
    ];
  }

  public static function getGameTypeID() {
    return 'bouncy';
  }

  public static function getController() {
    return new BouncyController();
  }

  public function getBoardState() {
    return $this->board_state;
  }

  public function getPlayerCommands() {
    return $this->player_commands;
  }

  public function setFinalized($finalized) {
    $this->finalized = $finalized;
  }

  public function isFinalized() {
    return $this->finalized;
  }

  public function getMetadata($user) {
    $toRet = array(
      'player_data' => $this->metadata->player_data,
      'game_started' => $this->metadata->game_started ?: false
    );
    if ($user) {
      $toRet['other_decks'] = array_map(
        function ($deck) {
          return $deck->serialize();
        },
        PlayerDeck::getAllDecksForPlayer($user)
      );
    }
    return $toRet;
  }

  public function createInitialMetadata() {
    $this->metadata = [
      'player_data' => $this->createTestPlayerData(),
    ];
    $datastore = DatastoreFactory::getDatastore();
    $datastore::saveGameObjectMetadataJSON($this);
  }

  public function saveMetadata() {
    $datastore = DatastoreFactory::getDatastore();
    $datastore::saveGameObjectMetadataJSON($this);
  }

  public static function createTestPlayerData() {
    $player_data = array(
      "0" => null,
      "1" => null,
      "2" => null,
      "3" => null,
    );
    return $player_data;
  }

  public function setPlayerCommand($playerID, $command) {
    if ($this->finalized) {
      throw new Exception("Can't set a command on a finalized turn");
    }

    $pc = json_decode($this->player_commands);
    $pc->$playerID = $command;
    $this->player_commands = json_encode($pc);
  }

  public function resetAllPlayerCommands() {
    $this->player_commands = "{}";
  }

  public function setBoardState($board_state) {
    if ($this->finalized) {
      throw new Exception("Can't set board state on a finalized turn");
    }
    $this->board_state = $board_state;
  }

  public function setGameOver($game_over, $players_won) {
    $this->game_over = $game_over === true || $game_over === "true";
    $this->players_won = $players_won === true || $players_won === "true";
  }
  public function isGameOver() { return $this->game_over; }
  public function didPlayersWin() { return $this->players_won; }

  public function startGame() {
    $this->metadata->game_started = true;
    $this->saveMetadata();
    return $this->metadata;
  }

  public function removePlayer($slot, $user) {
    if ($this->metadata->game_started) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->metadata->player_data[$slot];
    if (!$player_data_encoded) {
      throw new Exception("No player data in slot [" . $slot . "]");
    }

    $player_data = json_decode($player_data_encoded);
    if ($player_data->user_id !== $user->getID()) {
      throw new Exception("You can't remove someone that isn't yourself.");
    }

    $this->metadata->player_data[$slot] = null;
    $this->saveMetadata();
    return $this->metadata;
  }

  public function addPlayer($slot, $user) {
    if ($this->metadata->game_started) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->metadata->player_data[$slot];
    if (!!$player_data_encoded) {
      throw new Exception("Can't add a player to a full slot [" . $slot . "]");
    }

    $this->metadata->player_data[$slot] = json_encode(array(
      "user_id" => $user->getID(),
      "user_name" => $user->getUserName(),
      "ability_deck" => PlayerDeck::getDeckForPlayer($user, 0)->serialize()
    ));
    $this->saveMetadata();
    return $this->metadata;
  }

  public function changeDeck($slot, $deck_id, $user) {
    if ($this->metadata->game_started) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->metadata->player_data[$slot];
    if (!$player_data_encoded) {
      throw new Exception("Can't change the deck of an empty slot [" . $slot . "]");
    }

    $decoded_metadata = json_decode($this->metadata->player_data[$slot]);
    if ($decoded_metadata->user_id !== $user->getID()) {
      throw new Exception("Can't change the deck of someone else [" . $slot . "]");
    }

    $new_deck = PlayerDeck::getDeckForPlayer($user, $deck_id);
    if (!$new_deck) {
      throw new Exception("Couldn't find deck [" . $deck_id . "] for player [" . $user->getUserID() . "]");
    }
    $this->metadata->player_data[$slot] = json_encode(array(
      "user_id" => $user->getID(),
      "user_name" => $user->getUserName(),
      "ability_deck" => $new_deck->serialize()
    ));

    $this->saveMetadata();
    return $this->metadata;
  }
}
