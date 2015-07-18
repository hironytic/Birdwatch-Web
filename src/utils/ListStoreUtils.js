"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require("react/lib/keyMirror");
var Immutable = require("immutable");
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");

var ActionTypes = AppConstants.ActionTypes;
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

  createListActionCreator: function(loadingActionType, loadedActionType, queryProc, errorMessage) {
    return {
      loadList: function() {
        AppDispatcher.dispatch({
          type: loadingActionType
        });

        var query = queryProc();
        return Promise.resolve(query.find()).then(function (list) {
          return Immutable.List(list);
        }).catch(function(error) {
          AppDispatcher.dispatch({
            type: ActionTypes.ERROR_OCCURED,
            message1: errorMessage,
            message2: error.message
          });
          return Immutable.List();
        }).then(function(list) {
            AppDispatcher.dispatch({
              type: loadedActionType,
              list: list
            });
        });
      }
    };
  },
};

module.exports = ListStoreUtils;
