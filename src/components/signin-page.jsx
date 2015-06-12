React = require('react/addons');
NavBar = require('./nav-bar.jsx');

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      signinState: "init",
      userName: "",
      password: ""
    }
  },
  render: function() {
    var message;
    var btnClass = "btn btn-block ";
    if (this.state.signinState == "init") {
      message = "サインイン";
      btnClass += "btn-primary";
    } else if (this.state.signinState == "signingin") {
      message = "サインイン中…";
      btnClass += "btn-primary";
    } else if (this.state.signinState == "error") {
      message = "エラー";
      btnClass += "btn-danger";
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
                <button className={btnClass} type="submit">{message}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  handleSubmit: function(e) {
    var self = this;
    e.preventDefault();

    this.changeSigninState("signingin");
    this.setState({buttonMessage: "サインイン中..."});
    Parse.User.logIn(this.state.userName, this.state.password).then(function(user) {
      self.props.onSignedIn();
    }, function(error) {
      console.log("Failed to sign in: " + JSON.stringify(error));
      self.changeSigninState("error");
    });
  },
  changeSigninState: function(signinState) {
    this.setState({signinState: signinState});
  }
});
