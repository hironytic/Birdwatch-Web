"use strict";
var AppConstants = require("../constants/AppConstants");
var ListStoreUtils = require("../utils/ListStoreUtils");

var ActionTypes = AppConstants.ActionTypes;

var FamilyListStore = ListStoreUtils.createListStore(ActionTypes.FAMILY_LIST_LOADING, ActionTypes.FAMILY_LIST_LOADED);
module.exports = FamilyListStore;
