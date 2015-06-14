"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");

module.exports = {
  changePage: function(page) {
    if (page != null) {
      window.location.href = '#' + page;
    } else {
      AppDispatcher.dispatch({
        type: AppConstants.ActionTypes.PAGE_CHANGED,
      });
    }
  }
};
