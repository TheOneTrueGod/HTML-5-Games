var Game = IgeClass.extend({
	classId: 'Game',

	init: function (App, options) {
		// Create the engine
		ige = new IgeEngine();

		if (ige.isClient) {
			ige.client = new App();
		}

		if (ige.isServer) {
			ige.server = new App(options);
		}

		ige.characterFactory = new CharacterFactory();
		ige.worldSettings = new WorldSettings();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Game; } else { var game = new Game(Client); }
