"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  CHANGE: null,
});

var _list = Immutable.List();
var _loading = false;

var FamilyListStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(EventType.CHANGE);
  },

  addChangeListener: function(callback) {
    this.addListener(EventType.CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventType.CHANGE, callback);
  },

  getList: function() {
    return _list;
  },

  isLoading: function() {
    return _loading;
  }
});

FamilyListStore.dispatchToken = AppDispatcher.register(function(action) {
  var index;
  switch (action.type) {
    case ActionTypes.FAMILY_LIST_LOADING:
      _loading = true;
      _list = Immutable.List();
      FamilyListStore.emitChange();
      break;
    case ActionTypes.FAMILY_LIST_LOADED:
      _loading = false;
      _list = action.list;
      FamilyListStore.emitChange();
      break;
  }
});

module.exports = FamilyListStore;
