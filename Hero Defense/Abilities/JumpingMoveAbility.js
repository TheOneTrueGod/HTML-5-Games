var JumpingMoveAbility = Ability.extend({
	classId: 'JumpingMoveAbility',
	STAGE_CROUCH: 0,
	STAGE_JUMP: 1,
	STAGE_LAND: 2,

	CROUCH_TIME: 20,
	JUMP_TIME: 100,
	LAND_TIME: 10,
	startUsing(me, target) {
		me.abilityInfo.currAbil = this.classId();
		me.abilityInfo.currAbilStage = this.STAGE_CROUCH;
		me.abilityInfo.currAbilTime = 0;
		me.abilityInfo.currAbilTarget = target.charID;
	},
	doEffects(me) {
		me.abilityInfo.currAbilTime ++;

		switch (me.abilityInfo.currAbilStage) {
			case this.STAGE_CROUCH:
				me.velocity.x(0);
				me.velocity.y(0);
				if (me.abilityInfo.currAbilTime >= this.CROUCH_TIME) {
					me.abilityInfo.currAbilStage = this.STAGE_JUMP;
					me.abilityInfo.currAbilTime = 0;
				}
			break;
			case this.STAGE_JUMP:
				var target = me.abilityInfo.getTargetPosition();
				var angle = Math.atan2(
					target.y - me.translate().y(),
					target.x - me.translate().x()
				);

				me.velocity.x(Math.cos(angle) * 0.05);
				me.velocity.y(Math.sin(angle) * 0.05);

				var timePct = me.abilityInfo.currAbilTime / this.JUMP_TIME;

				var currZ = Math.sin(timePct * Math.PI) * 50;

				me.translateTo(me.translate().x(), me.translate().y(), currZ);

				if (me.abilityInfo.currAbilTime >= this.JUMP_TIME) {
					me.abilityInfo.currAbilStage = this.STAGE_LAND;
					me.abilityInfo.currAbilTime = 0;
				}
			break;
			case this.STAGE_LAND:
				me.velocity.x(0);
				me.velocity.y(0);
				me.translateTo(me.translate().x(), me.translate().y(), 0);
				if (me.abilityInfo.currAbilTime >= this.LAND_TIME) {
					me.abilityInfo.currAbil = null;
					me.abilityInfo.currAbilTime = 0;
				}
			break;
		}
	},
});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = JumpingMoveAbility; }
