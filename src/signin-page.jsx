React = require('react');
NavBar = require('./nav-bar.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar title="サインイン" />
        <div className="container">
          <form className="form-horizontal" onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="user" className="col-sm-2 col-sm-offset-2 control-label">ユーザー名</label>
              <div className="col-sm-5">
                <input className="form-control" type="text" id="user" />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 col-sm-offset-2 control-label">パスワード</label>
              <div className="col-sm-5">
                <input className="form-control" type="password" />
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-5 col-sm-offset-4">
                <button className="btn btn-primary btn-block">サインイン</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  onSubmit: function() {
    this.props.onSignedIn();
    return false;
  }
});
