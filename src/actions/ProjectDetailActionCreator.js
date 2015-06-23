"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  loadProjectDetail: function(projectId) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_LOADING
    });

    var query = new Parse.Query(Project);
    query.include(Project.Key.FAMILY);
    query.include(Project.Key.PLATFORM);
    query.get(projectId, {
      success: function(project) {
        AppDispatcher.dispatch({
          type: ActionTypes.PROJECT_DETAIL_LOADED,
          project: project
        });
      },
      error: function(error) {
        // TODO:
      }
    });
  }
};
