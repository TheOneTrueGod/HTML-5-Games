// Define our player character classes
var CharacterDef = IgeEntity.extend({
	classId: 'CharacterDef',

	init: function (npcImageType) {
    this.npcImageType = npcImageType;
	},

	getTexture: function() {
		throw "CharacterDef.getTexture must be overridden";
	},

  setupCharacterImage: function(character) {
    if (!ige.isClient) { return; }
		var self = this;
		var texture = this.getTexture();

    // Load the character texture file
		character._textureLoaded = false;
    character._characterTexture = texture;
    var imageType = this.npcImageType;
    // Wait for the texture to load
    texture.on('loaded', function () {
      character.texture(texture).dimensionsFromCell();
			character._textureLoaded = true;
			self.setupAnimations(character);
    }, false, true);
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

	setupAnimations: function(character) {
		throw "CharacterDef.setupAnimation must be overridden";
	},

  getNetworkCharacterData: function() {
    return {'npcImageType': this.npcImageType};
  }
});

CharacterDef.createFromNetworkData = function(networkData) {
	if (MonsterDefList.has(networkData.npcImageType)) {
		return new (MonsterDefList.get(networkData.npcImageType))();
	} else if (networkData.npcImageType == CharacterDef.CharTypes.PLAYER) {
		return new PlayerDef(networkData.npcImageType);
	}
	throw "No implementation for networkData.";
  return new CharacterDef(networkData.npcImageType);
};

CharacterDef.CharTypes = {
  PLAYER: 0,
  ACORN: 1,
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CharacterDef; }
