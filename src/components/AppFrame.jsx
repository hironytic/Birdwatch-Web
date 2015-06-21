"use strict";
var React = require("react");
var ReactRouter = require("react-router");

var HeaderBar = require("./HeaderBar.jsx");
var CurrentUserStore = require("../stores/CurrentUserStore");

var AppFrame = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],

  render: function() {
    return (
      <div>
        <HeaderBar/>
        {this.props.children}
      </div>
    );
  },

  componentDidMount: function() {
    CurrentUserStore.addStatusChangeListener(this.checkCurrentUserStatus);
    this.checkCurrentUserStatus();
  },

  componentWillUnmount: function() {
    CurrentUserStore.removeStatusChangeListener(this.checkCurrentUserStatus);
  },

  componentDidUpdate: function() {
    this.checkCurrentUserStatus();
  },

  // サインインしていなければ、サインイン画面へ飛ばす
  checkCurrentUserStatus: function() {
    if (!this.isActive("/signin") && CurrentUserStore.getStatus() != CurrentUserStore.StatusType.SIGNED_IN) {
      this.replaceWith("/signin", {path: this.props.location.pathname});
    }
  }
});

module.exports = AppFrame;
