React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container">
          <h1>Birdwatch <small>{this.props.title}</small></h1>
        </div>
      </div>
    );
  }
});
