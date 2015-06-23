"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  clearError: function(id) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_CLEARED,
      id: id
    });
  },

  clearAllErrors: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_ALL_CLEARED
    });
  }
};
