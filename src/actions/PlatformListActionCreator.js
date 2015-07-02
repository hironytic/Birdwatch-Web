"use strict";
var ListStoreUtils = require("../utils/ListStoreUtils");
var AppConstants = require("../constants/AppConstants");
var Platform = require("../objects/Platform");

var ActionTypes = AppConstants.ActionTypes;

var PlatformListActionCreator = ListStoreUtils.createListActionCreator(ActionTypes.PLATFORM_LIST_LOADING, ActionTypes.PLATFORM_LIST_LOADED, function() {
  var query = new Parse.Query(Platform);
  query.ascending(Platform.Key.NAME);
  return query;
}, "プラットフォーム一覧の取得に失敗");

module.exports = PlatformListActionCreator;
