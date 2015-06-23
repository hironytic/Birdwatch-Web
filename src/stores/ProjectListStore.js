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
var _loading = false;

var ProjectListStore = assign({}, EventEmitter.prototype, {
  emitProjectListChange: function() {
    this.emit(EventType.PROJECT_LIST_CHANGE);
  },

  addProjectListChangeListener: function(callback) {
    this.addListener(EventType.PROJECT_LIST_CHANGE, callback);
  },

  removeProjectListChangeListener: function(callback) {
    this.removeListener(EventType.PROJECT_LIST_CHANGE, callback);
  },

  getProjectList: function() {
    return _projectList;
  },

  isLoading: function() {
    return _loading;
  }
});

ProjectListStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.PROJECT_LIST_LOADING:
      _loading = true;
      _projectList = Immutable.List();
      ProjectListStore.emitProjectListChange();
      break;
    case ActionTypes.PROJECT_LIST_LOADED:
      _loading = false;
      _projectList = action.projectList;
      ProjectListStore.emitProjectListChange();
      break;
  }
});

module.exports = ProjectListStore;
