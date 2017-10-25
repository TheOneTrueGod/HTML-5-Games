<?php
  function addWorld($world) {
    ?>
    <div class="levelSelect world world<?php echo $world; ?> centerText">
      <div class="levelContainer"><div class="level boss"></div></div>
      <div class="levelContainer"><div class="level standard">3</div></div>
      <div class="levelContainer"><div class="level standard">2</div></div>
      <div class="levelContainer"><div class="level standard <?php if ($world == 1) { echo "selected"; }?>">1</div></div>
    </div>
    <?php
  }
?>
<link rel="stylesheet" type="text/css" href="../Bouncy/style/style.css">
<link rel="stylesheet" type="text/css" href="../Bouncy/style/unitTooltips.css">
<div class="pageBorder">
  <div class="titleArea">
    <h2> Reflectiles </h2>
    <div class="username"><?php echo $user->getUserName(); ?></div>
  </div>
  <div id="gameContainer"
    class="<?php echo $is_host ? 'isHost': ''; ?>"
    host="<?php echo $is_host ? 'true' : 'false'; ?>"
    playerID="<?php echo $this->user->getID(); ?>"
  >
    <div
      id="loadingContainer"
      class="screen"
    >
      <div class="loadingScreen">
        Loading
      </div>
    </div>
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
            <div class="unitDetailsContainer"></div>
            <div class="endTurnContainer">
              <button id="missionEndTurnButton">Finish Turn</button>
            </div>
          </div>
        </div>
        <div class="turnControls">
          <div class="timeline"><div class="timeline_progress"></div></div>
          <div class="healthbar_container">
            <div class="healthbar_progress"></div>
            <div class="healthbar_text"></div>
          </div>
        </div>
        <div id="missionProgramDisplay"></div>
      </div>
    </div>

    <div id="playerSetupBoard" class="screen" style="display: none;">
      <div class="gameSetupLevelSelect">
        <div class="difficultySelect centerText">
          <div class="button medium">Easy</div>
          <div class="button medium selected">Medium</div>
          <div class="button medium">Hard</div>
        </div>
        <?php for ($i = 1; $i <= 5; $i++) { addWorld($i); } ?>
      </div>
      <div class="gameSetupPlayers">
      <?php for ($i = 0; $i < 4; $i++) { ?>
        <div class="playerSetupSection" data-playerIndex="<?php echo $i; ?>">
          <div class="playerSetupInner">
            <div class="noPlayerSection" style="display: none;">
              <div class="joinGameButton button medium green">Join Game</div>
            </div>
            <div class="playerSection" style="display: none;">
              <div class="playerNameDisplay"></div>
              <div class="fullWidth centerText"><div class="startButton button small green">Start Game</div></div>
              <div class="fullWidth centerText"><div class="quitButton button small red">Quit</div></div>
              <div class="fullWidth centerText"><div class="abilityDeckName button small">Nothing</div></div>
            </div>
          </div>
        </div>
      <?php } ?>
      </div>
    </div>
  </div>
</div>
