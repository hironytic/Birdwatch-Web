"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  refreshList: function() {
    var query = new Parse.Query(Project);
    query.include(Project.Key.PLATFORM);
    query.find({
      success: function(projects) {
        AppDispatcher.dispatch({
          type: ActionTypes.PROJECT_LIST_REFRESHED,
          projectList: Immutable.List(projects)
        });
      },
      error: function(error) {
        // TODO:
      }
    });
  }
};
