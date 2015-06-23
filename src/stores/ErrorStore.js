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

var _lastErrorId = 10000;
var _errorList = Immutable.List();

var ErrorStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(EventType.CHANGE);
  },

  addChangeListener: function(callback) {
    this.addListener(EventType.CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventType.CHANGE, callback);
  },

  getErrorList: function() {
    return _errorList;
  }
});

ErrorStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.ERROR_OCCURED:
      _lastErrorId++;
      _errorList = _errorList.push({
        id: "id" + _lastErrorId.toString(),
        message1: action.message1,
        message2: action.message2
      });
      ErrorStore.emitChange();
      break;
    case ActionTypes.ERROR_CLEARED:
      _errorList = _errorList.filterNot(function(value) {
        return value.id == action.id;
      });
      ErrorStore.emitChange();
      break;
  }
});

module.exports = ErrorStore;
