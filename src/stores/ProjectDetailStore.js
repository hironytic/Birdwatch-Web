"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  PROJECT_CHANGE: null,
});

var _project = null;

var ProjectDetailStore = assign({}, EventEmitter.prototype, {
  emitProjectChange: function() {
    this.emit(EventType.PROJECT_CHANGE);
  },

  addProjectChangeListener: function(callback) {
    this.addListener(EventType.PROJECT_CHANGE, callback);
  },

  removeProjectChangeListener: function(callback) {
    this.removeListener(EventType.PROJECT_CHANGE, callback);
  },

  getProject : function() {
    return _project;
  }

});

ProjectDetailStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
  }
});

module.exports = ProjectDetailStore;
