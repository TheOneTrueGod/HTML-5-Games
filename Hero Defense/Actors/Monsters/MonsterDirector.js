var MonsterDirectory = IgeEntity.extend({
  classId: 'MonsterDirectory',
  componentId: 'monsterEntity',

  init: function (sourceX, sourceY) {
    this.x = sourceX;
    this.y = sourceY;
    this.monsterList = [];
    this.characterDef = new (MonsterDefList.get(CharacterDef.CharTypes.ACORN))();
  },

  doUpdate: function () {

  },

  createMonster: function() {
    var monster = ige.characterFactory
      .createCharacter(this.characterDef, MonsterComponentAcorn);
    monster.setPosition(this.x, this.y, 0);
    this.monsterList.push(monster);
    ige.server.npcs.push(monster);
  },

  /**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	_behaviour: function (ctx) {
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MonsterDirectory; }
