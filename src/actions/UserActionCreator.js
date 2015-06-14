"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var PageUtils = require("./PageUtils");

var ActionTypes = AppConstants.ActionTypes;
var Page = AppConstants.Page;

module.exports = {
  signin: function(userName, password) {
    AppDispatcher.dispatch({
      type: ActionTypes.USER_SIGNING_IN
    });

    Parse.User.logIn(userName, password).then(function(user) {
      AppDispatcher.dispatch({
        type: ActionTypes.USER_SIGNED_IN,
        user: user
      });
      PageUtils.changePage(null);
    }, function(error) {
      console.log("Failed to sign in: " + JSON.stringify(error));
      AppDispatcher.dispatch({
        type: ActionTypes.USER_FAILED_TO_SIGN_IN,
        error: error
      });
    });
  },

  signout: function() {
    Parse.User.logOut();
    AppDispatcher.dispatch({
      type: ActionTypes.USER_SIGNED_OUT
    });
    PageUtils.changePage("");
  }
};
