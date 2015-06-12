var React = require("react");
var NavBar = require("./NavBar.jsx");

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar title="プロジェクト一覧" />
      </div>
    );
  }
});
