"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  PROJECT_CHANGE: null,
  EDITING_CHANGE: null,
});

var _targetId = null;
var _project = null;
var _milestones = null;
var _isLoading = false;
var _isMilestonesLoading = false;
var _editing = false;

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

  getTargetId: function() {
    return _targetId;
  },

  getProject: function() {
    return _project;
  },

  getMilestones: function() {
    return _milestones;
  },

  isLoading: function() {
    return _isLoading;
  },

  isMilestonesLoading: function() {
    return _isMilestonesLoading;
  },

  emitEditingChange: function() {
    this.emit(EventType.EDITING_CHANGE);
  },

  addEditingChangeListener: function(callback) {
    this.addListener(EventType.EDITING_CHANGE, callback);
  },

  removeEditingChangeListener: function(callback) {
    this.removeListener(EventType.EDITING_CHANGE, callback);
  },

  isEditing: function() {
    return _editing;
  }
});

ProjectDetailStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.PROJECT_DETAIL_TARGET:
      if (_targetId != action.id) {
        _targetId = action.id;
        _project = null;
        _isLoading = false;
        _isMilestonesLoading = false;
        ProjectDetailStore.emitProjectChange();
        if (_editing) {
          _editing = false;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_LOADING:
      if (_targetId == action.id) {
        _isLoading = true;
        ProjectDetailStore.emitProjectChange();
        if (_editing) {
          _editing = false;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_LOADED:
      if (_targetId == action.id) {
        _isLoading = false;
        _project = action.project;
        ProjectDetailStore.emitProjectChange();
        if (_editing) {
          _editing = false;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_MILESTONES_LOADING:
      if (_targetId == action.id) {
        _isMilestonesLoading = true;
        ProjectDetailStore.emitProjectChange();
        if (_editing) {
          _editing = false;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_MILESTONES_LOADED:
      if (_targetId == action.id) {
        _isMilestonesLoading = false;
        _milestones = action.milestones;
        ProjectDetailStore.emitProjectChange();
        if (_editing) {
          _editing = false;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_START_EDITING:
      if (_targetId == action.id) {
        if (!_isLoading && !_isMilestonesLoading) {
          _editing = true;
          ProjectDetailStore.emitEditingChange();
        }
      }
      break;
    case ActionTypes.PROJECT_DETAIL_CANCEL_EDITING:
      if (_targetId == action.id) {
        _editing = false;
        ProjectDetailStore.emitEditingChange();
      }
      break;
  }
});

module.exports = ProjectDetailStore;
