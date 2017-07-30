<?php
class PlayerDeck {
  function __construct($id, $name, $deckJSON) {
    $this->id = $id;
    $this->name = $name;
    $this->deckJSON = $deckJSON;
  }

  public function serialize() {
    return array(
      'id' => $this->id,
      'name' => $this->name,
      'deckJSON' => $this->deckJSON
    );
  }

  public static function getDeckForPlayer($user, $index) {
    $all_decks = self::getAllDecksForPlayer($user);
    if (!(0 <= $index && $index < count($all_decks))) {
      throw new Exception("Deck Index [" . $index . "] out of bounds");
    }
    return $all_decks[$index];
  }

  public static function getAllDecksForPlayer($user) {
    return array(
      new PlayerDeck(0, "Test Deck the first", self::getTestDeck()),
      new PlayerDeck(1, "Empty Deck", "[]"),
      new PlayerDeck(2, "Some Third Deck", '[{
        "ability_type":"PROJECTILE",
        "shape":"SINGLE_SHOT",
        "contact_effect":"PENETRATE",
        "hit_effects":["DAMAGE"],
        "base_damage":300
      }]'),
      new PlayerDeck(3, "Fourth Deck", '[{
        "ability_type":"PROJECTILE","shape":"TRI_SHOT","contact_effect":"HIT","hit_effects":["DAMAGE"],"base_damage":100
      }]'),
      new PlayerDeck(4, "Fifth Deck", "[]"),
      new PlayerDeck(5, "Final Deck", "[]")
    );
  }

  private static function getTestDeck() {
    return '[
      {
        "ability_type":"PROJECTILE",
        "shape":"SINGLE_SHOT",
        "contact_effect":"PENETRATE",
        "hit_effects":["DAMAGE"],
        "base_damage":300
      },
      {
        "ability_type":"PROJECTILE",
        "shape":"SINGLE_SHOT",
        "contact_effect":"PASSTHROUGH",
        "hit_effects":["DAMAGE"],
        "num_hits":5,
        "base_damage":40
      },
      {
        "ability_type":"PROJECTILE","shape":"TRI_SHOT","contact_effect":"HIT","hit_effects":["DAMAGE"],"base_damage":100
      },
      {
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","contact_effect":"BOUNCE","hit_effects":["DAMAGE"],"base_damage":4,"bullet_waves":20,"bullet_wave_delay":5
      },
      {
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","contact_effect":"AOE_EFFECT","hit_effects":["DAMAGE","FREEZE"],"freeze":{"duration":2},"base_damage":40
      },
      {
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","contact_effect":"AOE_EFFECT","hit_effects":["DAMAGE","POISON"],"base_damage":30,"poison":{"damage":10,"duration":2,"effect":1.5}
      }
    ]';
  }
}
