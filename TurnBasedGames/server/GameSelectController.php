<?php
require_once('server/GameObject.php');
class GameSelectController {
  public static function getURLPath() {
    return '/games';
  }

  function getResponse($request) {
    $games = DatastoreFactory::getDatastore()->getGameList();
    ob_start(); ?>
      <div class="pageBorder">
        <h2> Game Select </h2>
        <div class="row titleTableRow">
          <div class="col-2">Game ID</div>
          <div class="col-8">Game Name</div>
          <div class="col-2">Actions</div>
        </div>

        <?php
        echo $this->getCreateGameRow(
          "Create Cards 'n Magic Game'",
          NewGameController::$GAME_TYPE_CARDS_N_MAGIC
        );
        echo $this->getCreateGameRow(
          "Create Bouncy Game",
          NewGameController::$GAME_TYPE_BOUNCY
        );
        foreach ($games as $game) {
          echo $this->getGameRow(GameObject::loadFromJSON(
            $game['game_json'],
            $game['metadata']
          ));
        }
        ?>
      </div>
    <?php
    return ob_get_clean();
  }

  function getCreateGameRow($text, $gameType) {
    ob_start(); ?>
    <div class="row tableRow">
      <div class="col-2"></div>
      <div class="col-8">
        <a href="<?php echo NewGameController::getURLPath($gameType); ?>">
          <?php echo $text ?>
        </a>
      </div>
      <div class="col-2">
      </div>
    </div>
    <?php
    return ob_get_clean();
  }

  function getGameRow($game) {
    $game_over = $game->isGameOver();
    $players_won = $game->didPlayersWin();
    ob_start(); ?>
    <div class="row tableRow<?php
      if ($game_over) { echo " game_over"; }
      if ($players_won) { echo " players_won"; }
    ?>">
      <div class="col-2"><?php echo $game->getID(); ?></div>
      <div class="col-8"><?php echo $game->getName(); ?></div>
      <div class="col-2">
      <?php if (!$game_over) { ?>
        <a href="<?php echo GameController::buildURL($game->getID()); ?>">
          Join
        </a>
      <?php } ?>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }
}
?>
