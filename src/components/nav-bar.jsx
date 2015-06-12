React = require('react')

module.exports = React.createClass({
  render: function() {
    var signOut = '';
    if (Parse.User.current() != null) {
      signOut = (
        <li><button className="btn-link" onClick={this.handleSignOut}>サインアウト</button></li>
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
  handleSignOut: function() {
    //FIXME: 本当はここでやらない
    Parse.User.logOut();
  }
});
