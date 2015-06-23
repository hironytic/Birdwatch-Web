"use strict";
var Promise = require("es6-promise").Promise;

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
    Promise.resolve(query.get(projectId)).catch(function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "プロジェクトの取得に失敗",
        message2: error.message
      });
      return null;
    }).then(function(project) {
      AppDispatcher.dispatch({
        type: ActionTypes.PROJECT_DETAIL_LOADED,
        project: project
      });
    });
  }
};
