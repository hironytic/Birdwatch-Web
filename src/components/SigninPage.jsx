var React = require("react/addons");
var NavBar = require("./NavBar.jsx");
var CurrentUserStore = require("../stores/CurrentUserStore");
var UserActionCreator = require("../actions/UserActionCreator");

StatusType = CurrentUserStore.StatusType;

module.exports = React.createClass({
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
    var btnClass = "btn btn-block ";
    var disabled = {};
    switch (this.state.status) {
      case StatusType.NOT_SIGNED_IN:
        message = "サインイン";
        btnClass += "btn-primary";
        break;
      case StatusType.SIGNING_IN:
        message = "サインイン中…";
        btnClass += "btn-default";
        disabled = {disabled: "disabled"};
        break;
      case StatusType.FAILED_TO_SIGN_IN:
        message = "エラー";
        btnClass += "btn-danger";
        break;
      case StatusType.SIGNED_IN:
        message = "成功";
        btnClass += "btn-success";
        break;
    }

    return (
      <div>
        <NavBar title="サインイン" />
        <div className="container">
          <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="user" className="col-sm-2 col-sm-offset-2 control-label">ユーザー名</label>
              <div className="col-sm-5">
                <input className="form-control" type="text" id="user" valueLink={this.linkState('userName')} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="col-sm-2 col-sm-offset-2 control-label">パスワード</label>
              <div className="col-sm-5">
                <input className="form-control" type="password" id="password" valueLink={this.linkState('password')} />
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-5 col-sm-offset-4">
                <button className={btnClass} type="submit" {...disabled}>{message}</button>
              </div>
            </div>
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
