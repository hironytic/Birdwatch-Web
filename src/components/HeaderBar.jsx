"use strict";
var React = require("react")
var ReactBootstrap = require('react-bootstrap')
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

var HeaderBar = React.createClass({
  getInitialState: function() {
    return {
      user: CurrentUserStore.getUser()
    };
  },

  render: function() {
    var signOut = '';
    if (this.state.user != null) {
      signOut = (
        <NavItem onClick={this.handleSignOut}>サインアウト</NavItem>
      );
    }

    return (
      <Navbar brand="Birdwatch">
        <Nav right>
          {signOut}
        </Nav>
      </Navbar>
    );
  },

  handleSignOut: function(e) {
    e.preventDefault();
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
