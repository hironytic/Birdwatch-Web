"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  TIMELINE_CHANGE: null,
});

var _timeline = Immutable.List();
var _loading = false;

var TimelineStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(EventType.TIMELINE_CHANGE);
  },

  addChangeListener: function(callback) {
    this.addListener(EventType.TIMELINE_CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventType.TIMELINE_CHANGE, callback);
  },

  getTimeline: function() {
    return _timeline;
  },

  isLoading: function() {
    return _loading;
  }
});

TimelineStore.dispatchToken = AppDispatcher.register(function(action) {
  var index;
  switch (action.type) {
    case ActionTypes.TIMELINE_LOADING:
      _loading = true;
      _timeline = Immutable.List();
      TimelineStore.emitChange();
      break;
    case ActionTypes.TIMELINE_LOADED:
      _loading = false;
      _timeline = action.timeline;
      TimelineStore.emitChange();
      break;
  }
});

module.exports = TimelineStore;
