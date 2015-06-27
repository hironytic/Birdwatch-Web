"use strict";

var Key = {
  PROJECT: "project",
  MILESTONE: "milestone",
  INTERNAL_DATE: "internalDate",
  DATE_STRING: "dateString"
};

var ProjectMilestone = Parse.Object.extend("ProjectMilestone", {
  getProject: function() {
    return this.get(Key.PROJECT);
  },

  setProject: function(value) {
    this.set(Key.PROJECT, value);
  },

  getMilestone: function() {
    return this.get(Key.MILESTONE);
  },

  setMilestone: function(value) {
    this.set(Key.MILESTONE, value);
  },

  getInternalDate: function() {
    return this.get(Key.INTERNAL_DATE);
  },

  setInternalDate: function(value) {
    this.set(Key.INTERNAL_DATE, value);
  },

  getDateString: function() {
    return this.get(Key.DATE_STRING);
  },

  setDateString: function(value) {
    this.set(Key.DATE_STRING, value);
  }
}, {
  Key: Key
});

module.exports = ProjectMilestone;
