"use strict";
var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var Immutable = require("immutable");

var ActionTypes = AppConstants.ActionTypes;
var Page = AppConstants.Page;

module.exports = {
  loadProjectList: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_LIST_LOADING
    })

    var query = new Parse.Query(Project);
    query.include(Project.Key.PLATFORM);
    query.find({
      success: function(projects) {
        AppDispatcher.dispatch({
          type: ActionTypes.PROJECT_LIST_LOADED,
          projectList: Immutable.List(projects)
        });
      },
      error: function(error) {
        // TODO:
      }
    });
  }
};
