"use strict";
var Promise = require("es6-promise").Promise;
var Immutable = require("immutable");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var ProjectMilestone = require("../objects/ProjectMilestone");

var ActionTypes = AppConstants.ActionTypes;

function _loadProjectDetail(projectId) {
  AppDispatcher.dispatch({
    type: ActionTypes.PROJECT_DETAIL_LOADING,
    id: projectId,
  });

  var query = new Parse.Query(Project);
  query.include(Project.Key.FAMILY);
  query.include(Project.Key.PLATFORM);
  Promise.resolve(query.get(projectId)).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクトの取得に失敗",
      message2: error.message,
    });
    return null;
  }).then(function(project) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_LOADED,
      id: projectId,
      project: project,
    });

    // マイルストーンのロード
    _loadProjectMilestones(project);
  });
}

function _loadProjectMilestones(project) {
  if (project == null) {
    return;
  }

  var id = project.id;
  AppDispatcher.dispatch({
    type: ActionTypes.PROJECT_DETAIL_MILESTONES_LOADING,
    id: id,
  });

  var query = new Parse.Query(ProjectMilestone);
  query.equalTo(ProjectMilestone.Key.PROJECT, project);
  query.include(ProjectMilestone.Key.MILESTONE);
  query.ascending(ProjectMilestone.Key.INTERNAL_DATE);
  Promise.resolve(query.find()).then(function(milestones) {
    return Immutable.List(milestones);
  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "マイルストーンの取得に失敗",
      message2: error.message,
    });
    return Immutable.List();
  }).then(function(milestones) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_MILESTONES_LOADED,
      id: id,
      milestones: milestones,
    });
  });
}

module.exports = {
  setProjectTarget: function(projectId) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_TARGET,
      id: projectId,
    });
  },

  loadProjectDetail: function(projectId) {
    _loadProjectDetail(projectId);
  },

  startEditing: function(projectId) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_START_EDITING,
      id: projectId,
    });
  },

  cancelEditing: function(projectId) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_CANCEL_EDITING,
      id: projectId,
    });
  },
};
