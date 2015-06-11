var BirdwatchApp = React.createClass({displayName: "BirdwatchApp",
  render: function() {
    return (
      React.createElement("h1", null, "Birdwatch App!")
    );
  }
});

React.render(React.createElement(BirdwatchApp, null), document.getElementById('main-content'));
