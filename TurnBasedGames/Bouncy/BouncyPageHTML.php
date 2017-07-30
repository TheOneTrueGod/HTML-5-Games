<link rel="stylesheet" type="text/css" href="/Bouncy/style.css">
<div class="pageBorder">
  <div class="titleArea">
    <h2> Reflectiles </h2>
    <div class="username"><?php echo $user->getUserName(); ?></div>
  </div>
  <div id="gameContainer"
    host="<?php echo $is_host ? 'true' : 'false'; ?>"
    playerID="<?php echo $this->user->getID(); ?>"
  >
    <div
      id="gameBoard"
      class="screen"
      style="display: none;"
      data-gameID="<?php echo $game_id ?>"
    >
      <div id="inMissionScreen">
        <div id="missionControlsActionBox">
          <div id="missionActionDisplay">
            <div id="warningMessageBox" style="display: none;"></div>
            <div class="overlay"></div>
          </div>
          <div id="missionControlsDisplay">
            <div class="playerStatusContainer"></div>
            <div class="endTurnContainer">
              <button id="missionEndTurnButton">Finish Turn</button>
            </div>
          </div>
        </div>
        <div class="turnControls">
          <div class="timeline"><div class="timeline_progress"></div></div>
          <div class="healthbar_container"><div class="healthbar_progress"></div></div>
        </div>
        <div id="missionProgramDisplay"></div>
      </div>
    </div>

    <div id="playerSetupBoard" class="screen" style="display: none;">
      <?php for ($i = 0; $i < 4; $i++) { ?>
        <div class="playerSetupSection" data-playerIndex="<?php echo $i; ?>">
          <div class="playerSetupInner">
            <div class="noPlayerSection" style="display: none;">
              <div class="joinGameButton"><div>Join Game</div></div>
            </div>
            <div class="playerSection" style="display: none;">
              <div class="playerNameDisplay"></div>
              <div class="startButton"><div>Start Game</div></div>
              <div class="quitButton"><div>Quit</div></div>
              <div class="abilityDeckName"><div>Nothing</div></div>
            </div>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>
</div>
