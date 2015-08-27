"use strict";
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var FamilyListActionCreator = require("../actions/FamilyListActionCreator");
var PlatformListActionCreator = require("../actions/PlatformListActionCreator");
var MilestoneListActionCreator = require("../actions/MilestoneListActionCreator");
var CurrentUserStore = require("../stores/CurrentUserStore");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  initialize: function() {
    var promise;

    if (CurrentUserStore.getStatus() != CurrentUserStore.StatusType.SIGNED_IN) {
      // サインインしていなければ何もしなくていい
      promise = Promise.resolve(null);
    } else {
      promise = Promise.all([
        FamilyListActionCreator.loadList(),
        PlatformListActionCreator.loadList(),
        MilestoneListActionCreator.loadList(),
      ]);
    }

    promise = promise.then(function() {
      AppDispatcher.dispatch({
        type: ActionTypes.APP_INITIALIZED,
      });
    });
  },
};
