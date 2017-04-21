var WorldSettings = IgeClass.extend({
  classId: 'WorldSettings',
  componentId: 'worldSettings',

  init: function (options) {
    this.seed = 5;
    this.allCharacters = new Map();
    this.monsterCharacters = new Map();
    this.playerCharacters = new Map();
    this.npcs = new Map();
  },

  addCharacter: function(character) {
    this.allCharacters.set(character.charID, character);
    if (character.team == Character.TEAM.PLAYER) {
      this.playerCharacters.set(character.charID, character);
    } else if (character.team == Character.TEAM.MONSTER) {
      this.monsterCharacters.set(character.charID, character);
    } else if (character.team == Character.TEAM.NEUTRAL) {
      this.npcs.set(character.charID, character);
    }
  },

  getWorldWidthTiles: function() {
    return 60;
  },
  getWorldHeightTiles: function() {
    return 60;
  },
  getTileWidth: function() {
    return 40;
  },
  getTileHeight: function() {
    return 40;
  },
  getPlayerSpawnPosition: function(playerID) {
    return [5, 5];
  },
  getDirectorLocations: function() {
    return [{x: 10, y: 10}];//, {x: 30, y: 10}, {x: 10, y: 30}, {x: 30, y: 30}];
  },
  InitializeDirectors: function() {
    var directorLocations = this.getDirectorLocations();
    for (var i = 0; i < directorLocations.length; i++) {
      var director = new MonsterDirector(directorLocations[i].x, directorLocations[i].y)
      ige.server.directors.push(director);

      director.createMonster();
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = WorldSettings; }
