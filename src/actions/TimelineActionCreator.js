"use strict";
var Immutable = require("immutable");
var Promise = require("es6-promise").Promise;

var AppDispatcher = require("../dispatcher/AppDispatcher");
var AppConstants = require("../constants/AppConstants");
var ProjectMilestone = require("../objects/ProjectMilestone");
var Project = require("../objects/Project");
var moment = require("moment");

var ActionTypes = AppConstants.ActionTypes;

module.exports = {
  loadTimeline: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.TIMELINE_LOADING
    })

    var today = moment();
    today.hour(0);
    today.second(0);
    today.minute(0);
    var minDate = today.subtract(3, 'days').toDate();
    var query = new Parse.Query(ProjectMilestone);
    query.include(ProjectMilestone.Key.PROJECT);
    query.include(ProjectMilestone.Key.MILESTONE);
    query.include(ProjectMilestone.Key.PROJECT + "." + Project.Key.FAMILY);
    query.include(ProjectMilestone.Key.PROJECT + "." + Project.Key.PLATFORM);
    query.greaterThan(ProjectMilestone.Key.INTERNAL_DATE, minDate);
    query.ascending(ProjectMilestone.Key.INTERNAL_DATE);
    return Promise.resolve(query.find()).then(function (milestones) {
      return Immutable.List(milestones);
    }).catch(function(error) {
      AppDispatcher.dispatch({
        type: ActionTypes.ERROR_OCCURED,
        message1: "タイムラインの取得に失敗",
        message2: error.message
      });
      return Immutable.List();
    }).then(function(timeline) {
        AppDispatcher.dispatch({
          type: ActionTypes.TIMELINE_LOADED,
          timeline: timeline
        });
    });
  },
};
