"use strict";
var React = require("react/addons");
var ReactRouter = require("react-router");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var ProjectListStore = require("../stores/ProjectListStore");
var ProjectListActionCreator = require("../actions/ProjectListActionCreator");

var Project = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],

  getInitialState: function() {
    return {
      projectList: ProjectListStore.getProjectList()
    };
  },

  render: function() {
    var projectItems = this.state.projectList.map(function(project) {
      var href = this.makeHref("/project");
      var isActive = this.isActive("/project/" + project.id);
      return (
        <ListGroupItem key={project.id} active={isActive} href={href}>{project.getName()}</ListGroupItem>
      );
    }.bind(this)).toArray();

    return (
      <div className="container">
        <Panel header="プロジェクト">
          <ListGroup fill>
            {projectItems}
          </ListGroup>
        </Panel>
        {this.props.children}
      </div>
    );
  },

  componentDidMount: function() {
    ProjectListStore.addProjectListChangeListener(this.handleProjectListChange);
    ProjectListActionCreator.refreshList();
  },

  componentWillUnmount: function() {
    ProjectListStore.removeProjectListChangeListener(this.handleProjectListChange);
  },

  handleProjectListChange: function() {
    this.setState({
      projectList: ProjectListStore.getProjectList()
    });
  }
});

module.exports = Project;
