"use strict";
var React = require("react/addons");

var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailViewer = require("./ProjectDetailViewer.jsx");
var ProjectDetailEditor = require("./ProjectDetailEditor.jsx");

var ProjectDetail = React.createClass({
  getInitialState: function() {
    return {
      isEditing: ProjectDetailStore.isEditing(),
    };
  },

  render: function() {
    if (this.state.isEditing) {
      return <ProjectDetailEditor id={this.props.params.id}/>;
    } else {
      return <ProjectDetailViewer id={this.props.params.id}/>;
    }
  },

  componentDidMount: function() {
    ProjectDetailStore.addEditingChangeListener(this.handleEditingChange);
  },

  componentWillUnmount: function() {
    ProjectDetailStore.removeEditingChangeListener(this.handleEditingChange);
  },

  handleEditingChange: function() {
    this.setState({
      isEditing: ProjectDetailStore.isEditing()
    });
  },
});

module.exports = ProjectDetail;
