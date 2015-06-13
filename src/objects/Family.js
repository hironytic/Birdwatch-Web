var Key = {
  NAME: "name",
  COLOR_STRING: "colorString"
};

var Family = Parse.Object.extend("Family", {
  getName: function() {
    return this.get(Key.NAME);
  },

  setName: function(value) {
    this.set(Key.NAME, value);
  },

  getColorString: function() {
    return this.get(Key.COLOR_STRING);
  },

  setColorString: function(value) {
    this.set(Key.COLOR_STRING, value);
  }
}, {
  Key: Key
});

module.exports = Family;
