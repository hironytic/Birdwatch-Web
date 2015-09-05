"use strict";
var React = require("react")
var ReactRouter = require("react-router");
var ReactBootstrap = require('react-bootstrap')
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

var HeaderBar = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],

  getInitialState: function() {
    return {
      user: CurrentUserStore.getUser()
    };
  },

  render: function() {
    var activeKey;
    if (this.isActive("project")) {
      activeKey = "project";
    } else if (this.isActive("timeline")) {
      activeKey = "timeline";
    }

    var userSignedIn = (this.state.user != null);
    return (
      <Navbar brand="Birdwatch" fluid>
        <Nav bsStyle="pills" activeKey={activeKey} onSelect={this.handleNavSelect}>
          <NavItem eventKey="timeline" disabled={!userSignedIn}>タイムライン</NavItem>
          <NavItem eventKey="project" disabled={!userSignedIn}>プロジェクト管理</NavItem>
        </Nav>
        <Nav right>
          {this.renderUserMenu()}
        </Nav>
      </Navbar>
    );
  },

  renderUserMenu: function() {
    if (this.state.user == null) {
      return "";
    }

    return (
      <DropdownButton title={this.state.user.get("username")} navItem={true}>
        <MenuItem onSelect={this.handleSignOut}>サインアウト</MenuItem>
      </DropdownButton>
    );
  },

  handleSignOut: function() {
    UserActionCreator.signout();
  },

  componentDidMount: function() {
    CurrentUserStore.addUserChangeListener(this.handleUserChange);
  },

  componentWillUnmount: function() {
    CurrentUserStore.removeUserChangeListener(this.handleUserChange);
  },

  handleUserChange: function(signinState) {
    this.setState({
      user: CurrentUserStore.getUser()
    });
  },

  handleNavSelect: function(selectedKey) {
    if (this.isActive(selectedKey)) {
      return;
    }

    this.transitionTo("/" + selectedKey);
  },
});

module.exports = HeaderBar;
