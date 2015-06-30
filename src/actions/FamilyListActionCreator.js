"use strict";
var Immutable = require("immutable");
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Family = require("../objects/Family");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  loadList: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.FAMILY_LIST_LOADING
    })

    var query = new Parse.Query(Family);
    query.ascending(Family.Key.NAME);
    Promise.resolve(query.find()).then(function (list) {
      return Immutable.List(list);
    }).catch(function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "プロダクト一覧の取得に失敗",
        message2: error.message
      });
      return Immutable.List();
    }).then(function(list) {
        AppDispatcher.dispatch({
          type: ActionTypes.FAMILY_LIST_LOADED,
          list: list
        });
    });
  }
};
