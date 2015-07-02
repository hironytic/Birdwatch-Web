"use strict";
var ListStoreUtils = require("../utils/ListStoreUtils");
var AppConstants = require("../constants/AppConstants");
var Milestone = require("../objects/Milestone");

var ActionTypes = AppConstants.ActionTypes;

var MilestoneListActionCreator = ListStoreUtils.createListActionCreator(ActionTypes.MILESTONE_LIST_LOADING, ActionTypes.MILESTONE_LIST_LOADED, function() {
  var query = new Parse.Query(Milestone);
  query.ascending(Milestone.Key.ORDER);
  return query;
}, "マイルストーン一覧の取得に失敗");

module.exports = MilestoneListActionCreator;
