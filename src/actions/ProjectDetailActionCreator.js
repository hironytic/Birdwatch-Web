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
    return Immutable.List(milestones).sort(function(mlstn1, mlstn2) {
      var dateResult = mlstn1.getInternalDate().getTime() - mlstn2.getInternalDate().getTime();
      if (dateResult == 0) {
        return mlstn1.getMilestone().getOrder() - mlstn2.getMilestone().getOrder();
      } else {
        return dateResult;
      }
    });
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

  // project自体について
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
  Promise.resolve((modified) ? project.save() : project).then(function() {
    // milestonesについて
    // 追加されたもの & 変更されたもの
    var dontRemove = Immutable.Set();
    var addModList = newMilestones.map(function(newMilestone) {
      var projectMilestone;
      if (newMilestone.get("isNew")) {
        var milestoneACL = new Parse.ACL();
        milestoneACL.setPublicReadAccess(false);
        milestoneACL.setPublicWriteAccess(false);
        milestoneACL.setRoleReadAccess("Administrator", true);
        milestoneACL.setRoleWriteAccess("Administrator", true);
        milestoneACL.setRoleReadAccess("Viewer", true);
        milestoneACL.setRoleWriteAccess("Viewer", false);

        projectMilestone = new ProjectMilestone();
        projectMilestone.setACL(milestoneACL);

        projectMilestone.setProject(project);
        projectMilestone.setMilestone(newMilestone.get("milestone"));
        projectMilestone.setInternalDate(newMilestone.get("internalDate"));
        projectMilestone.setDateString(newMilestone.get("dateString"));
      } else {
        var modified = false;
        projectMilestone = milestones.find(function(mlstn) { return mlstn.id == newMilestone.get("id"); });
        if (projectMilestone != null) {
          dontRemove = dontRemove.add(projectMilestone.id);

          if (projectMilestone.getMilestone().id != newMilestone.get("milestone").id) {
            projectMilestone.setMilestone(newMilestone.get("milestone"));
            modified = true;
          }
          if (projectMilestone.getInternalDate() != newMilestone.get("internalDate")) {
            projectMilestone.setInternalDate(newMilestone.get("internalDate"));
            modified = true;
          }
          if (projectMilestone.getDateString() != newMilestone.get("dateString")) {
            projectMilestone.setDateString(newMilestone.get("dateString"));
            modified = true;
          }

          if (!modified) {
            // 変更がなければ更新の必要なし
            projectMilestone = null;
          }
        }
      }
      return projectMilestone;
    }).filter(function(value) { return value != null; }).toArray();

    // 削除されたもの
    var delList = milestones.filterNot(function(mlstn) { return dontRemove.includes(mlstn.id); }).toArray();

    return Promise.all([
      Promise.resolve((addModList.length > 0) ? Parse.Object.saveAll(addModList) : null),
      Promise.resolve((delList.length > 0) ? Parse.Object.destroyAll(delList) : null),
    ]);
  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクトの更新に失敗",
      message2: error.message,
    });
  }).then(function() {
    _loadProjectDetail(targetId);
  });
}

function _deleteProject(projectId) {
  var project = new Project();
  project.id = projectId;

  // プロジェクトに紐付いたマイルストーンを取得後、
  // それとプロジェクトを合わせて destroyAll で削除する。
  var query = new Parse.Query(ProjectMilestone);
  query.equalTo(ProjectMilestone.Key.PROJECT, project);
  return Promise.resolve(query.find()).then(function(objects) {
    objects.push(project);
    return Promise.resolve(Parse.Object.destroyAll(objects));
  }).then(function() {
    AppDispatcher.dispatch({
      type: ActionTypes.PROJECT_DELETED,
      id: projectId,
    });
  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクトの削除に失敗",
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

  commitEditing: function(targetId, newValues, newMilestones) {
    _updateProjectDetail(targetId, newValues, newMilestones);
  },

  deleteProject: function(projectId) {
    return _deleteProject(projectId);
  },
};
