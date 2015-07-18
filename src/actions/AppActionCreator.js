"use strict";
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var FamilyListActionCreator = require("../actions/FamilyListActionCreator");
var PlatformListActionCreator = require("../actions/PlatformListActionCreator");
var MilestoneListActionCreator = require("../actions/MilestoneListActionCreator");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  initialize: function() {
    Promise.all([
      FamilyListActionCreator.loadList(),
      PlatformListActionCreator.loadList(),
      MilestoneListActionCreator.loadList(),
    ]).then(function() {
      AppDispatcher.dispatch({
        type: ActionTypes.APP_INITIALIZED,
      });
    });
  },
};
