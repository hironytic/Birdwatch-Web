"use strict";
var React = require("react");
var NavBar = require("./NavBar.jsx");
var ProjectDetailStore = require("../stores/ProjectDetailStore");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      project: ProjectDetailStore.getProject()
    };
  },

  render: function() {
    var projectPanel;
    if (this.state.project == null) {
      projectPanel = <div/>
    } else {
      projectPanel = (
        <div>
        </div>
      );
    }

    return (
      <div>
        <NavBar title="プロジェクト詳細" />
        {projectPanel}
      </div>
    );
  }
});
