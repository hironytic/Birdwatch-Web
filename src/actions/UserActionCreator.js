"use strict";
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  signin: function(userName, password) {
    AppDispatcher.dispatch({
      type: ActionTypes.USER_SIGNING_IN
    });

    Promise.resolve(Parse.User.logIn(userName, password)).then(function(user) {
      AppDispatcher.dispatch({
        type: ActionTypes.USER_SIGNED_IN,
        user: user
      });
    }).catch(function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "サインインできませんでした。",
        message2: error.message
      });
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
  }
};
