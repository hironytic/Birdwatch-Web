"use strict";
var Promise = require("es6-promise").Promise;
var Immutable = require("immutable");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var ProjectMilestone = require("../objects/ProjectMilestone");
var ProjectDetailStore = require("../stores/ProjectDetailStore");

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

function _updateProjectDetail(targetId, newValues, newMilestones) {
  if (ProjectDetailStore.getTargetId() != targetId) {
    return;
  }

  var project = ProjectDetailStore.getProject();
  var milestones = ProjectDetailStore.getMilestones();

  var modified = false;
  if (project.getName() != newValues.name) {
    project.setName(newValues.name);
    modified = true;
  }
  if (project.getProjectCode() != newValues.projectCode) {
    project.setProjectCode(newValues.projectCode);
    modified = true;
  }
  if (project.getFamily().id != newValues.family.id) {
    project.setFamily(newValues.family);
    modified = true;
  }
  if (project.getPlatform().id != newValues.platform.id) {
    project.setPlatform(newValues.platform);
    modified = true;
  }
  if (project.getVersion() != newValues.version) {
    project.setVersion(newValues.version);
    modified = true;
  }
  Promise.resolve((modified) ? project.save() : project).then(function(project) {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DETAIL_LOADED,
      id: targetId,
      project: project,
    });
  }).then(function() {
    // 追加されたもの & 変更されたもの

  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクトの更新に失敗",
      message2: error.message,
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

  commitEditing: function(project, newValues) {
    _updateProjectDetail(project, newValues);
  },
};
