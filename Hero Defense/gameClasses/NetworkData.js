// Define our player character classes
var NetworkData = {
  CharacterData: IgeClass.extend({
    classId: 'NetworkData.CharacterData',
    init(data) {
      this.data = data;
    },
    getData() {
      return this.data;
    }
  })
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NetworkData; }
