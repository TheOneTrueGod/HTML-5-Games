// Define our player character classes
var Character = IgeEntity.extend({
	classId: 'Character',

	init: function (characterData) {
		var self = this;
		this.charID = Character.IDIndex++;
		this.team = Character.TEAM.NEUTRAL;
		IgeEntity.prototype.init.call(this);
		this.streamSections(["transform"]);

		// Set the co-ordinate system as isometric
		this.isometric(false);
		if (characterData.classId == CharacterDef.prototype.classId()) {
			this._characterDef = characterData;
		} else {
			this._characterDef = CharacterDef.createFromNetworkData(characterData);
		}

		this.addComponent(IgeVelocityComponent);

		if (ige.isClient) {
			// Setup the entity
			self.addComponent(IgeAnimationComponent)
				.depth(1);
			this._characterDef.setupCharacterImage(this);
		}
		this._lastTranslate = this._translate.clone();
	},
	setTarget: function(targetID) {
		this.target = targetID;
	},
	setPosition: function (x, y) {
		this.translateTo(
			x * ige.worldSettings.getTileWidth(),
			y * ige.worldSettings.getTileHeight(),
			this.translate().z()
		);
	},
	update: function (ctx, tickDelta) {
		if (ige.isClient && this._textureLoaded) {
			var self = this,
				oldX = this._lastTranslate.x,
				oldY = this._lastTranslate.y * 2,
				currX = this.translate().x(),
				currY = this.translate().y() * 2,
				distX = currX - oldX,
				distY = currY - oldY,
				distance = Math.distance(
					oldX,
					oldY,
					currX,
					currY
				),
				speed = 0.1,
				time = (distance / speed);

			this._lastTranslate = this._translate.clone();

			// Set the current animation based on direction
			this._characterDef.updateDisplay(this, distX, distY);

			// Set the depth to the y co-ordinate which basically
			// makes the entity appear further in the foreground
			// the closer they become to the bottom of the screen
			this.depth(this._translate.y);
			this.anchor(0, -this.translate().z());
		}

		IgeEntity.prototype.update.call(this, ctx, tickDelta);
	},

	destroy: function () {
		// Destroy the texture object
		if (this._characterTexture) {
			this._characterTexture.destroy();
		}

		// Call the super class
		IgeEntity.prototype.destroy.call(this);
	},

	streamSectionData: function(sectionId, data, bypassTimeStream) {
		if (sectionId == 'position') {
			if (ige.isServer) {
				return [];
			} else {
				return ;
			}
		} else {
      // The section was not one that we handle here, so pass this
      // to the super-class streamSectionData() method - it handles
      // the "transform" section by itself
      return IgeEntity.prototype.streamSectionData.call(this, sectionId, data, bypassTimeStream);
    }
	},

	streamCreateData: function () {
		return this._characterDef.getNetworkCharacterData();
  }
});

Character.IDIndex = 1;
Character.TEAM = {NEUTRAL: 0, PLAYER: 1, NPC: 1, MONSTER: 2};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }
