"use strict";
var React = require("react");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var HashHistory = require("react-router/lib/HashHistory");
var Promise = require("es6-promise").Promise;

var AppFrame = require("./components/AppFrame.jsx");
var Signin = require("./components/Signin.jsx");
var Project = require("./components/Project.jsx");
var ProjectDetail = require("./components/ProjectDetail.jsx");
var FamilyListActionCreator = require("./actions/FamilyListActionCreator");
var PlatformListActionCreator = require("./actions/PlatformListActionCreator");
var MilestoneListActionCreator = require("./actions/MilestoneListActionCreator");

// FIXME: こんなのはだめだー
Promise.all([
  FamilyListActionCreator.loadList(),
  PlatformListActionCreator.loadList(),
  MilestoneListActionCreator.loadList(),
]).then(function() {
  React.render((
    <Router history={new HashHistory}>
      <Route path="/" component={AppFrame}>
        <Route path="signin" component={Signin}/>
        <Route path="project" component={Project}>
          <Route path=":id" component={ProjectDetail}/>
        </Route>
      </Route>
    </Router>
  ), document.getElementById('main-content'));
});
