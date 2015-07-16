"use strict";
var Immutable = require("immutable");
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var Project = require("../objects/Project");
var FamilyListStore = require("../stores/FamilyListStore");
var PlatformListStore = require("../stores/PlatformListStore");

var ActionTypes = AppConstants.ActionTypes;

function _loadProjectList() {
  AppDispatcher.dispatch({
    type: ActionTypes.PROJECT_LIST_LOADING
  })

  var query = new Parse.Query(Project);
  query.include(Project.Key.PLATFORM);
  return Promise.resolve(query.find()).then(function (projects) {
    return Immutable.List(projects);
  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクト一覧の取得に失敗",
      message2: error.message
    });
    return Immutable.List();
  }).then(function(projectList) {
      AppDispatcher.dispatch({
        type: ActionTypes.PROJECT_LIST_LOADED,
        projectList: projectList
      });
  });
}

function _createNewProject(router) {
  var projectACL = new Parse.ACL();
  projectACL.setPublicReadAccess(false);
  projectACL.setPublicWriteAccess(false);
  projectACL.setRoleReadAccess("Administrator", true);
  projectACL.setRoleWriteAccess("Administrator", true);
  projectACL.setRoleReadAccess("Viewer", true);
  projectACL.setRoleWriteAccess("Viewer", false);

  var project = new Project();
  project.setACL(projectACL);
  project.setName("新規プロジェクト");
  project.setFamily(FamilyListStore.getList().first());
  project.setPlatform(PlatformListStore.getList().first());
  project.setProjectCode("");
  project.setVersion("");

  Promise.resolve(project.save()).then(function(project) {
    return project.id;
  }).catch(function(error) {
    AppDispatcher.dispatch({
      type: ActionTypes.ERROR_OCCURED,
      message1: "プロジェクトの作成に失敗",
      message2: error.message,
    });
    return null;
  }).then(function(projectId) {
    _loadProjectList().then(function() {
      if (projectId != null && router != null) {
        router.replaceWith("/project/" + projectId);
      }
    })
  });
}

module.exports = {
  loadProjectList: function() {
    _loadProjectList();
  },

  createNewProject: function(router) {
    _createNewProject(router);
  },
};
