"use strict";
var ListStoreUtils = require("../utils/ListStoreUtils");
var AppConstants = require("../constants/AppConstants");
var Family = require("../objects/Family");

var ActionTypes = AppConstants.ActionTypes;

var FamilyListActionCreator = ListStoreUtils.createListActionCreator(ActionTypes.FAMILY_LIST_LOADING, ActionTypes.FAMILY_LIST_LOADED, function() {
  var query = new Parse.Query(Family);
  query.ascending(Family.Key.NAME);
  return query;
}, "プロダクト一覧の取得に失敗");

module.exports = FamilyListActionCreator;
