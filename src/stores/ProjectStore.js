"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  PROJECT_LIST_CHANGE: null,
});

var _projectList = Immutable.List();

var ProjectStore = assign({}, EventEmitter.prototype, {
  emitProjectListChange: function() {
    this.emit(EventType.PROJECT_LIST_CHANGE);
  },

  addProjectListChangeListener: function(callback) {
    this.addListener(EventType.PROJECT_LIST_CHANGE, callback);
  },

  removeProjectListChangeListener: function(callback) {
    this.removeListener(EventType.PROJECT_LIST_CHANGE, callback);
  },

  getProjectList : function() {
    return _projectList;
  }

});

ProjectStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.PROJECT_LIST_REFRESHED:
      _projectList = action.projectList;
      ProjectStore.emitProjectListChange();
      break;
  }
});

module.exports = ProjectStore;
