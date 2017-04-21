var renderer = PIXI.autoDetectRenderer(
  Constants.gameWidth,
  Constants.gameHeight,
  {backgroundColor : 0x222222}
);
document.body.appendChild(renderer.view);

var Game = new GameObj();
var mainScreen = (new MainScreen()).init();

Game.init();

// start animating
function animate() {
  const timeScale = 1;
  mainScreen.animationFrame(timeScale);

  requestAnimationFrame(animate);
  // render the root container
  mainScreen.render(renderer);
}

animate();
