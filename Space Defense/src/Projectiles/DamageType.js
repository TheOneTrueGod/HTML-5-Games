class DamageType {
  constructor(damageMap) {
    if (damageMap['default'] === undefined) {
      throw "Damage maps must have a default entry";
    }
    this.amount = damageMap['default'];
    this.damageMap = damageMap;
  }

  damageTarget(target) {
    var amount = this.amount;
    if (target.armorType) {
      if (this.damageMap[target.armorType]) {
        amount = this.damageMap[target.armorType];
      }
    }
    
    target.dealDamage(amount);
  }
}
