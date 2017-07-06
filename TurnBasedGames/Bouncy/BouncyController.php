<?php
const BOUNCY_SERVER_ACTIONS = [
  'GET_BOARD_DATA' => 'get_board_data',
  'SET_BOARD_AT_TURN_START' => 'set_board_at_turn_start',
  'FINALIZE_TURN' => 'finalize_turn',
  'SUBMIT_PLAYER_COMMANDS' => 'submit_player_commands'
];

class BouncyController {
  private $gameObject;
  private $request;
  private $user;

  public function getResponse($request, $gameObject, $user) {
    $action = $request->param('action');
    $this->request = $request;
    $this->gameObject = $gameObject;
    $this->user = $user;

    if(!$action) {
      return $this->getGameHTML();
    }

    switch ($action) {
      case BOUNCY_SERVER_ACTIONS['GET_BOARD_DATA']:
        return $this->getBoardData();
      case BOUNCY_SERVER_ACTIONS['SET_BOARD_AT_TURN_START']:
        if (!$this->user->isHost()) {
          throw new Exception("Only the host can do this action");
        }
        return $this->setBoardAtTurnStart();
      case BOUNCY_SERVER_ACTIONS['FINALIZE_TURN']:
        if (!$this->user->isHost()) {
          throw new Exception("Only the host can do this action");
        }
        return $this->finalizeTurn();
      case BOUNCY_SERVER_ACTIONS['SUBMIT_PLAYER_COMMANDS']:
        return $this->savePlayerCommands();
      break;
    }
    throw new Exception("$action not handled in BouncyController");
    return "";
  }

  private function getGameHTML() {
    $is_host = $this->user->isHost();
    ob_start(); ?>
    <link rel="stylesheet" type="text/css" href="/Bouncy/style.css">
    <div class="pageBorder">
      <h2> Bouncy! </h2>
      <div id="turn">
        <?php echo "Turn " . $this->gameObject->getCurrentTurn(); ?>
      </div>
      <div id="gameContainer"
        host="<?php echo $is_host ? 'true' : 'false'; ?>"
        playerID="<?php echo $this->user->getID(); ?>"
      >
        <div id="gameBoard" data-gameID="<?php echo $this->gameObject->getID() ?>">
          <div id="inMissionScreen">
            <div id="missionControlsActionBox">
              <div id="missionActionDisplay">
                <div class="overlay"></div>
              </div>
              <div id="missionControlsDisplay">
                <div>Controls</div>
                <div class="endTurnContainer">
                  <button id="missionEndTurnButton">Finish Turn</button>
                </div>
              </div>
            </div>
            <div class="turnControls">
              <div class="timeline"><div class="timeline_progress"></div></div>
            </div>
            <div id="missionProgramDisplay"></div>
          </div>
        </div>
      </div>
    </div>
    <?php require('Bouncy/js_includes.html'); ?>
    <?php
    return ob_get_clean();
  }

  private function getBoardData() {
    return json_encode(
      [
        'board_state' => $this->gameObject->getBoardState(),
        'player_commands' => $this->gameObject->getPlayerCommands()
      ]
    );
  }

  private function setBoardAtTurnStart() {
    if (!$this->user->isHost()) {
      throw new Exception("You're not the host");
    }

    if ($this->request->param('turn') !== $this->gameObject->getCurrentTurn()) {
      $this->gameObject->setFinalized(false);
      $this->gameObject->resetAllPlayerCommands();
    }

    $this->gameObject->setBoardState(
      $this->request->param('board_state')
    );

    $this->gameObject->setCurrentTurn(
      $this->request->param('turn')
    );
    $this->gameObject->save();
  }

  private function finalizeTurn() {
    $this->gameObject->setFinalized(true);
    $this->gameObject->save();
    return $this->gameObject->getPlayerCommands();
  }

  private function savePlayerCommands() {
    $this->gameObject->setPlayerCommand(
      $this->user->getID(),
      $this->request->param('playerCommands')
    );
    $this->gameObject->save();
  }
}
