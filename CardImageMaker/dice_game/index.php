<?php
class AbilityCard {
  function __construct($name) {
    $this->name = $name;
  }

  function getCardHTML() {
    ob_start(); ?>
    <div class="abilityCard">
      <div class="cardName">
        <?php echo $this->name; ?>
      </div>
      <div class="cardConstantsGranted">
        <?php echo $this->name; ?>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }
}

$abilityCards = array(
  new AbilityCard("Basic")
);
?>
<html>
  <head>
    <link href="style.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="dice_game/html2canvas.js"></script>
    <link href="dice_game/style.css" rel="stylesheet">
  </head>
  <body>
    <div id="input">
      <?php
        foreach ($abilityCards as $card) {
          print_r($card->getCardHTML());
        }
      ?>
    </div>
    <div id="outputDiv">
    </div>
  </body>
  <script>
    html2canvas($('#input'), {
      onrendered: function(canvas) {
        $('#outputDiv').append(canvas);
      }
    });
  </script>
</html>
