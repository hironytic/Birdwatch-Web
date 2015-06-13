"use strict";

var Key = {
  NAME: "name",
  FAMILY: "family",
  PLATFORM: "platform",
  PROJECT_CODE: "projectCode",
  VERSION: "version"
};

var Project = Parse.Object.extend("Project", {
  getName: function() {
    return this.get(Key.NAME);
  },

  setName: function(value) {
    this.set(Key.NAME, value);
  },

  getFamily: function() {
    return this.get(Key.FAMILY);
  },

  setFamily: function(value) {
    this.set(Key.FAMILY, value);
  },

  getPlatform: function() {
    return this.get(Key.PLATFORM);
  },

  setPlatform: function(value) {
    this.set(Key.PLATFORM, value);
  },

  getProjectCode: function() {
    return this.get(Key.PROJECT_CODE);
  },

  setProjectCode: function(value) {
    this.set(Key.PROJECT_CODE, value);
  },

  getVersion: function() {
    return this.get(Key.VERSION);
  },

  setVersion: function(value) {
    this.set(Key.VERSION, value);
  }
}, {
  Key: Key
});

module.exports = Project;
