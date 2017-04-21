var MonsterComponentAcorn = IgeEntity.extend({
	classId: 'MonsterComponentAcorn',
	componentId: 'playerControl',
	init: function (entity, options) {
		MonsterComponent.prototype.init.call(this, entity, options);
		this.abilities = new Map();
		this.abilities.set(JumpingMoveAbility.prototype.classId(), new JumpingMoveAbility());
		entity.abilityInfo = new Ability.AbilityInfo();
	},

	_behaviour: function (ctx) {
		if (!ige.isServer) { return; }
		var me = this._entity;

		if (me.abilityInfo.currAbil !== null) {
			var abil = this.abilities.get(me.abilityInfo.currAbil);
			abil.doEffects(me);
			return;
		}

		if (!me.target) {
			var newTarget = null;
			for (var [key, value] of ige.worldSettings.playerCharacters) {
				newTarget = value;
			}
			if (value) {
				me.setTarget(value.charID);
			}
		}
		if (me.target) {
			var target = ige.worldSettings.allCharacters.get(me.target);
			var dist = Math.pow(
				Math.pow(target.translate().y() - me.translate().y(), 2) +
				Math.pow(target.translate().x() - me.translate().x(), 2)
			, 0.5);

			if (dist > 60) {
				this.abilities.get(JumpingMoveAbility.prototype.classId()).startUsing(
					me,
					target
				);
			}
		} else {
			if (ige.worldSettings.playerCharacters.size > 0) {
				console.log("No target???");
			}
		}
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MonsterComponentAcorn; }
