var Key = {
  NAME: "name"
};

var Platform = Parse.Object.extend("Platform", {
  getName: function() {
    return this.get(Key.NAME);
  },

  setName: function(value) {
    this.set(Key.NAME, value);
  }
}, {
  Key: Key
});

module.exports = Platform;
