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
    if ($index === null) {
      $index = 3;
      switch ($user->getUserName()) {
        case "Jabberwookie":
          $index = 0;
          break;
        case "ILoveTheLag":
          $index = 1;
          break;
        case "Tabitha":
          $index = 2;
          break;
      }
    }
    $all_decks = self::getAllDecksForPlayer($user);
    if (!(0 <= $index && $index < count($all_decks))) {
      throw new Exception("Deck Index [" . $index . "] out of bounds");
    }
    return $all_decks[$index];
  }

  public static function getAllDecksForPlayer($user) {
    return array(
      new PlayerDeck(0, "TJ's Deck", self::getTJDeck()),
      new PlayerDeck(1, "Chip's Deck", self::getChipDeck()),
      new PlayerDeck(2, "Tabitha's Deck", self::getTabithaDeck()),
      new PlayerDeck(3, "Sean's Deck", self::getSeanDeck()),
    );
  }

  private static function getTJDeck() {
    return '['
      . self::getShotgunAbility() . ',' .
      '{
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":150,"aoe_type":"BOX"}],"icon":"../Bouncy/assets/icon_plain_explosion.png"
      },{
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":200}],"bullet_waves":6
      },{
        "ability_type":"PROJECTILE","shape":"RAIN","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":20}],"num_bullets":50,"icon":"../Bouncy/assets/icon_plain_rain.png"
      },{
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":60},{"effect":"BULLET_SPLIT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":40}],"num_bullets":6}],"bullet_waves":5,"bullet_wave_delay":5,"icon":"../Bouncy/assets/icon_plain_splurt.png",
        "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
      }
    ]';
  }

  private static function getShotgunAbility() {
    return '{"ability_type":"PROJECTILE","shape":"SPRAY_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":100}],"num_bullets":12}';
  }

  private static function getChipDeck() {
    return '[{
      "ability_type":"PROJECTILE","shape":"TRI_SHOT","projectile_type":"HIT","num_bullets_per_side":2,"hit_effects":[{"effect":"DAMAGE","base_damage":200}]
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"PENETRATE","hit_effects":[{"effect":"DAMAGE","base_damage":1000}],"icon":"../Bouncy/assets/icon_plain_drill.png"
    },{
      "ability_type":"ZONE","unit_interaction":{"prevent_unit_entry":true,"unit_enter":[{"effect":"ABILITY","ability_source":"BELOW_UNIT","abil_def":{"ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"PENETRATE","hit_effects":[{"effect":"DAMAGE","base_damage":400}]}}]},"duration":5,"zone_size":{"left":1,"right":1,"top":0,"bottom":0,"y_range": 0},"unit_enter_effect":{},"icon":"../Bouncy/assets/icon_plain_shield.png",
      "charge":{"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},"projectile_interaction": {"reflects_enemy_projectiles":true, "destroy":true}
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"FREEZE","duration":3}],"icon":"../Bouncy/assets/icon_plain_frost.png",
      "charge":{"initial_charge":-1,"max_charge":2,"charge_type":"TURNS"}
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":"50%","aoe_type":"BOX","aoe_size":{"x":[-2,2],"y":[-2,0]}}],"icon":"../Bouncy/assets/icon_plain_hearts.png"
    }]';
  }


  private static function getTestDeck() {
    return '[
      {
        "ability_type":"PROJECTILE",
        "shape":"SINGLE_SHOT",
        "projectile_type":"PENETRATE",
        "hit_effects":["DAMAGE"],
        "base_damage":300
      },
      {
        "ability_type":"PROJECTILE",
        "shape":"SINGLE_SHOT",
        "projectile_type":"PASSTHROUGH",
        "hit_effects":["DAMAGE"],
        "num_hits":5,
        "base_damage":40
      },
      {
        "ability_type":"PROJECTILE","shape":"TRI_SHOT","projectile_type":"HIT","hit_effects":["DAMAGE"],"base_damage":100
      },
      {
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","projectile_type":"BOUNCE","hit_effects":["DAMAGE"],"base_damage":4,"bullet_waves":20,"bullet_wave_delay":5
      },
      {
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"AOE_EFFECT","hit_effects":["DAMAGE","FREEZE"],"freeze":{"duration":2},"base_damage":40
      },
      {
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"AOE_EFFECT","hit_effects":["DAMAGE","POISON"],"base_damage":30,"poison":{"damage":10,"duration":2,"effect":1.5}
      }
    ]';
  }

  private static function getTabithaDeck() { return '[]'; }
  private static function getSeanDeck() { return '[]'; }
}

// For Sean;
// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// Passthrough projectile.
// AoE Explodes on contact.
