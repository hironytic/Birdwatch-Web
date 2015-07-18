"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require('react/lib/keyMirror');
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  CHANGE: null,
});

var _isInitializing = true;

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(EventType.CHANGE);
  },

  addChangeListener: function(callback) {
    this.addListener(EventType.CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventType.CHANGE, callback);
  },

  isInitializing: function() {
    return _isInitializing;
  },
});

AppStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.APP_INITIALIZED:
      _isInitializing = false;
      AppStore.emitChange();
      break;
  }
});

module.exports = AppStore;
