var Ability = IgeClass.extend({
	classId: 'Ability',
});
Ability.AbilityInfo = IgeClass.extend({
  classId: 'AbilityInfo',
  init: function() {
    this.currAbil = null;
    this.currAbilStage = null;
    this.currAbilTime = 0;
    this.currAbilTarget = null;
  },

  getTargetPosition: function() {
    if (Number.isInteger(this.currAbilTarget)) {
      var pos = ige.worldSettings.allCharacters.get(this.currAbilTarget).translate();
      return {x: pos.x(), y: pos.y()}
    }
    return this.currAbilTarget;
  }
})

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Ability; }
