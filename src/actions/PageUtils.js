"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");

module.exports = {
  changePage: function(page, parameter) {
    if (page != null) {
      var fragment = page;
      if (parameter != null) {
        // FIXME: encode parameter
        fragment += "/" + parameter;
      }
      window.location.href = "#" + fragment;
    } else {
      AppDispatcher.dispatch({
        type: AppConstants.ActionTypes.PAGE_CHANGED,
      });
    }
  }
};
