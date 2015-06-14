"use strict";
var React = require("react")
var MainContent = require("./components/MainContent.jsx")
var AppDispatcher = require("./dispatcher/AppDispatcher");
var AppConstants = require("./constants/AppConstants");

React.render(<MainContent />, document.getElementById('main-content'));

window.addEventListener("hashchange", function(e) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.PAGE_CHANGED,
  });
});
