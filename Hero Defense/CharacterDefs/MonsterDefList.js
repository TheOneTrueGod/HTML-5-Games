var MonsterDefList = new Map();
MonsterDefList.set(
  CharacterDef.CharTypes.ACORN,
  CharacterDef.extend({
    classId: 'AcornMonsterDef',
    init: function () {
      CharacterDef.prototype.init.call(this, CharacterDef.CharTypes.ACORN);
  	},
    getTexture: function() {
      return new IgeCellSheet('./Assets/m_acorn.png', 1, 9);
    },
    setupAnimations: function(character) {
      var walkAnimation = [0, 1, 2];
      character.animation.define('walkDown', [0, 1, 2], 8, -1)
        .animation.define('walkLeft', [0, 1, 2], 8, -1)
        .animation.define('walkRight', [0, 1, 2], 8, -1)
        .animation.define('walkUp', [0, 1, 2], 8, -1)
        .animation.define('jumpCharge', [], 8, -1) // Continue from here
        .cell(1);

      character._restCell = 0;
  	},
    updateDisplay: function(character, distX, distY) {
  		if (Math.abs(distX) <= 0.01 && Math.abs(distY) <= 0.01) {
  			character.animation.stop();
  		} else {
  			var angle = Math.atan2(distY, distX) + Math.PI;
  			if (
  				angle > Math.PI / 2.0 * 1 - Math.PI / 4.0 &&
  				angle < Math.PI / 2.0 * 1 + Math.PI / 4.0
  			) {
  				character.animation.select('walkUp');
  			} else if (
  				angle > Math.PI / 2.0 * 2 - Math.PI / 4.0 &&
  				angle < Math.PI / 2.0 * 2 + Math.PI / 4.0
  			) {
  				character.animation.select('walkRight');
  			} else if (
  				angle > Math.PI / 2.0 * 3 - Math.PI / 4.0 &&
  				angle < Math.PI / 2.0 * 3 + Math.PI / 4.0
  			) {
  				character.animation.select('walkDown');
  			} else {
  				character.animation.select('walkLeft');
  			}
  		}
  	},
  })
);

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MonsterDefList; }
