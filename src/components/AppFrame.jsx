"use strict";
var React = require("react");
var ReactRouter = require("react-router");
var ReactBootstrap = require("react-bootstrap");
var Navbar = ReactBootstrap.Navbar;

var HeaderBar = require("./HeaderBar.jsx");
var ErrorList = require("./ErrorList.jsx");
var CurrentUserStore = require("../stores/CurrentUserStore");
var AppStore = require("../stores/AppStore");

var AppFrame = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],

  getInitialState: function() {
    return {
      isAppInitializing: AppStore.isInitializing(),
    };
  },

  render: function() {
    if (this.state.isAppInitializing) {
      return (
        <div>
          <Navbar brand="Birdwatch" fluid />
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <HeaderBar/>
          <ErrorList/>
          {this.props.children}
        </div>
      );
    }
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this.handleAppStatusChange);
    CurrentUserStore.addStatusChangeListener(this.checkCurrentUserStatus);
    this.checkCurrentUserStatus();
  },

  componentWillUnmount: function() {
    CurrentUserStore.removeStatusChangeListener(this.checkCurrentUserStatus);
    AppStore.removeChangeListener(this.handleAppStatusChange);
  },

  componentDidUpdate: function() {
    this.checkCurrentUserStatus();
  },

  // サインインしていなければ、サインイン画面へ飛ばす
  checkCurrentUserStatus: function() {
    if (!this.isActive("/signin") && CurrentUserStore.getStatus() != CurrentUserStore.StatusType.SIGNED_IN) {
      this.replaceWith("/signin", {path: this.props.location.pathname});
    }
  },

  handleAppStatusChange: function() {
    this.setState({
      isAppInitializing: AppStore.isInitializing(),
    });
  },
});

module.exports = AppFrame;
