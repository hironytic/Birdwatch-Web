"use strict";
var AppConstants = require("../constants/AppConstants");
var ListStoreUtils = require("../utils/ListStoreUtils");

var ActionTypes = AppConstants.ActionTypes;

var PlatformListStore = ListStoreUtils.createListStore(ActionTypes.PLATFORM_LIST_LOADING, ActionTypes.PLATFORM_LIST_LOADED);
module.exports = PlatformListStore;
