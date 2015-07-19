"use strict";
var React = require("react")
var ReactBootstrap = require('react-bootstrap')
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

var HeaderBar = React.createClass({
  getInitialState: function() {
    return {
      user: CurrentUserStore.getUser()
    };
  },

  render: function() {
    return (
      <Navbar brand="Birdwatch" fluid>
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
  }

});

module.exports = HeaderBar;
