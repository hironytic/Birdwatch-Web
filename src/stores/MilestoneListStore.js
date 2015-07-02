"use strict";
var AppConstants = require("../constants/AppConstants");
var ListStoreUtils = require("../utils/ListStoreUtils");

var ActionTypes = AppConstants.ActionTypes;

var MilestoneListStore = ListStoreUtils.createListStore(ActionTypes.MILESTONE_LIST_LOADING, ActionTypes.MILESTONE_LIST_LOADED);
module.exports = MilestoneListStore;
