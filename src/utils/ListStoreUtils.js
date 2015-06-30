"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");
var Immutable = require("immutable");

var EventType = keyMirror({
  CHANGE: null,
});

var ListStoreUtils = {
  createListStore: function(loadingActionType, loadedActionType) {
    var _list = Immutable.List();
    var _loading = false;

    var listStore = assign({}, EventEmitter.prototype, {
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

    listStore.dispatchToken = AppDispatcher.register(function(action) {
      var index;
      switch (action.type) {
        case loadingActionType:
          _loading = true;
          _list = Immutable.List();
          listStore.emitChange();
          break;
        case loadedActionType:
          _loading = false;
          _list = action.list;
          listStore.emitChange();
          break;
      }
    });

    return listStore;
  },
};

module.exports = ListStoreUtils;
