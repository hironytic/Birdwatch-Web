"use strict";
var React = require("react/addons");
var ReactBootstrap = require('react-bootstrap')
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var HeaderBar = require("./HeaderBar.jsx");
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

var StatusType = CurrentUserStore.StatusType;

var SigninPage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      status: CurrentUserStore.getStatus(),
      userName: "",
      password: ""
    }
  },

  render: function() {
    var message;
    var bsStyle = "primary";
    var disabled = false;
    switch (this.state.status) {
      case StatusType.NOT_SIGNED_IN:
        message = "サインイン";
        bsStyle = "primary";
        break;
      case StatusType.SIGNING_IN:
        message = "サインイン中…";
        bsStyle = "default";
        disabled = true;
        break;
      case StatusType.FAILED_TO_SIGN_IN:
        message = "エラー";
        bsStyle = "danger";
        break;
      case StatusType.SIGNED_IN:
        message = "成功";
        bsStyle = "success";
        break;
    }

    return (
      <div>
        <HeaderBar/>
        <div className="container">
          <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
            <Input type="text"
                  label="ユーザー名"
                  labelClassName="col-xs-2 col-xs-offset-2"
                  wrapperClassName="col-xs-5"
                  valueLink={this.linkState('userName')}/>
            <Input type="password"
                  label="パスワード"
                  labelClassName="col-xs-2 col-xs-offset-2"
                  wrapperClassName="col-xs-5"
                  valueLink={this.linkState('password')}/>
            <ButtonInput type="submit"
                        wrapperClassName="col-xs-5 col-xs-offset-4"
                        bsStyle={bsStyle}
                        disabled={disabled}
                        value={message}
                        block/>
          </form>
        </div>
      </div>
    );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.status != StatusType.SIGNING_IN) {
      UserActionCreator.signin(this.state.userName, this.state.password);
    }
  },

  componentDidMount: function() {
    CurrentUserStore.addStatusChangeListener(this.handleUserStatusChange);
  },

  componentWillUnmount: function() {
    CurrentUserStore.removeStatusChangeListener(this.handleUserStatusChange);
  },

  handleUserStatusChange: function() {
    this.setState({
      status: CurrentUserStore.getStatus()
    });
  }
});

module.exports = SigninPage;
