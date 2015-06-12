React = require('react');
NavBar = require('./NavBar.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar title="プロジェクト一覧" />
      </div>
    );
  }
});
