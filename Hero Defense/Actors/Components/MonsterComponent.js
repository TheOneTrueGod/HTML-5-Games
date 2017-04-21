var MonsterComponent = IgeEntity.extend({
	classId: 'MonsterComponent',
	componentId: 'playerControl',

	init: function (entity, options) {
		var self = this;

		// Store the entity that this component has been added to
		this._entity = entity;

		// Store any options that were passed to us
		this._options = options;

		// Add the playerComponent behaviour to the entity
		this._entity.addBehaviour('monsterComponent_behaviour', this._behaviour.bind(this));
		this._entity.team = Character.TEAM.MONSTER;
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	_behaviour: function (ctx) {
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MonsterComponent; }
