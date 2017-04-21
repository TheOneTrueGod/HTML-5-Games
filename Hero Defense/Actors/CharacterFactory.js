var CharacterFactory = IgeClass.extend({
  classId: 'CharacterFactory',

  init: function () {

  },

  createCharacter: function(image, component) {
    var character = new Character(image)
      .addComponent(component)
      .streamMode(1)
      .mount(ige.server.foregroundScene);
    ige.worldSettings.addCharacter(character);
    return character;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CharacterFactory; }
