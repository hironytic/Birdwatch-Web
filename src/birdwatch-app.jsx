var React = require('react')

var BirdwatchApp = React.createClass({
  render: function() {
    return (
      <h1>Birdwatch App!</h1>
    );
  }
});

React.render(<BirdwatchApp />, document.getElementById('main-content'));
