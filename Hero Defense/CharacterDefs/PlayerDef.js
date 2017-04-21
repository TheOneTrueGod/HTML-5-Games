// Define our player character classes
var PlayerDef = CharacterDef.extend({
  classId: 'PlayerDef',
  init: function () {
    CharacterDef.prototype.init.call(this, CharacterDef.CharTypes.PLAYER);
  },
  getTexture: function() {
    return new IgeCellSheet('../assets/textures/sprites/vx_chara02_c.png', 12, 8);
  },
  setupAnimations: function(character) {
    character.animation.define('walkDown', [1, 2, 3, 2], 8, -1)
      .animation.define('walkLeft', [13, 14, 15, 14], 8, -1)
      .animation.define('walkRight', [25, 26, 27, 26], 8, -1)
      .animation.define('walkUp', [37, 38, 39, 38], 8, -1)
      .cell(1);

    character._restCell = 1;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerDef; }
