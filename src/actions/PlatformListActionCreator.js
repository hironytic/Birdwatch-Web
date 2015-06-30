"use strict";
var Immutable = require("immutable");
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Platform = require("../objects/Platform");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  loadList: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.PLATFORM_LIST_LOADING
    });

    var query = new Parse.Query(Platform);
    query.ascending(Platform.Key.NAME);
    Promise.resolve(query.find()).then(function (list) {
      return Immutable.List(list);
    }).catch(function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "プラットフォーム一覧の取得に失敗",
        message2: error.message
      });
      return Immutable.List();
    }).then(function(list) {
        AppDispatcher.dispatch({
          type: ActionTypes.PLATFORM_LIST_LOADED,
          list: list
        });
    });
  }
};
