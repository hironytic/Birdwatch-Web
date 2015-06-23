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
    query.find().then(function(projects) {
      return Immutable.List(projects);
    }, function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "プロジェクト一覧の取得に失敗",
        message2: error.message
      });
      AppDispatcher.dispatch({
        type: ActionTypes.PROJECT_LIST_LOADED,
        projectList: Immutable.List()
      });
    }).then(function(projectList) {
        AppDispatcher.dispatch({
          type: ActionTypes.PROJECT_LIST_LOADED,
          projectList: projectList
        });
    });
  }
};
