var Key = {
  NAME: "name",
  ORDER: "order"
};

var Milestone = Parse.Object.extend("Milestone", {
  getName: function() {
    return this.get(Key.NAME);
  },

  setName: function(value) {
    this.set(Key.NAME, value);
  },

  getOrder: function() {
    return this.get(Key.ORDER);
  },

  setOrder: function(value) {
    this.set(Key.ORDER, value);
  }
}, {
  Key: Key
});

module.exports = Milestone;
