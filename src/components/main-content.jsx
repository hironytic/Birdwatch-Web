var React = require('react')
var SigninPage = require('./signin-page.jsx');
var ProjectsPage = require('./projects-page.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    var page = (Parse.User.current() == null) ? 'signin' : 'projects';
    return {
      page: page
    };
  },
  render: function() {
    if (this.state.page == 'signin') {
      return (<SigninPage onSignedIn={this.onSignedIn}/>);
    } else if (this.state.page == 'projects') {
      return (<ProjectsPage/>);
    } else {
      return (<div/>);
    }
  },
  onSignedIn: function() {
    this.setState({
      page: 'projects'
    });
  }
});
