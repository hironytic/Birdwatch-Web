"use strict";
var React = require("react")
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

var NavBar = React.createClass({
  getInitialState: function() {
    return {
      user: CurrentUserStore.getUser()
    };
  },

  render: function() {
    var signOut = '';
    if (this.state.user != null) {
      signOut = (
        <li><button className="btn btn-link" onClick={this.handleSignOut}>サインアウト</button></li>
      );
    }
    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <h1>Birdwatch <small>{this.props.title}</small></h1>
          <div className="navbar-collapse collapse navbar-responsive-collapse navbar-right">
            <ul className="nav navbar-nav">
              {signOut}
            </ul>
          </div>
        </div>
      </div>
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

module.exports = NavBar;
