"use strict";
var React = require("react/addons");
var ReactRouter = require("react-router");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Label = ReactBootstrap.Label;

var ProjectListStore = require("../stores/ProjectListStore");
var ProjectListActionCreator = require("../actions/ProjectListActionCreator");

var Project = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],

  getInitialState: function() {
    return {
      projectList: ProjectListStore.getProjectList(),
      isLoading: ProjectListStore.isLoading()
    };
  },

  render: function() {
    return (
      <Grid>
        <Row>
          <Col xs={4}>
            <Panel header="プロジェクト" style={{position: "fixed", "height": "512"}}>
              {this.renderProjectList()}
            </Panel>
          </Col>
          <Col xs={8}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  },

  renderProjectList: function() {
    var projectItems;

    if (this.state.isLoading) {
      projectItems = (
        <ListGroupItem key="loading">
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        </ListGroupItem>
      );
    } else {
      projectItems = this.state.projectList.map(function(project) {
        // var href = this.makeHref("/project/" + project.id);
        var href = "#/project/" + project.id;
        var isActive = this.isActive("/project/" + project.id);
        var header = project.getName();
        var header = (
          <span>{project.getName()} <Label bsStyle="warning">{project.getPlatform().getName()}</Label></span>
        );
        return (
          <ListGroupItem key={"id_" + project.id} active={isActive} href={href} header={header}>{project.getProjectCode()}</ListGroupItem>
        );
      }.bind(this));
      if (true) {
        projectItems = projectItems.push(
          <ListGroupItem key="new" href="#" onClick={this.handleNewProject}>
            <Glyphicon glyph='plus'/>
            プロジェクトを作成
          </ListGroupItem>
        );
      }
      projectItems = projectItems.toArray();
    }

    return (
      <ListGroup fill style={{height: "470", "overflowY": "scroll"}}>
        {projectItems}
      </ListGroup>
    );
  },

  componentDidMount: function() {
    ProjectListStore.addProjectListChangeListener(this.handleProjectListChange);
    setTimeout(function() {
      ProjectListActionCreator.loadProjectList();
    }.bind(this), 0);
  },

  componentWillUnmount: function() {
    ProjectListStore.removeProjectListChangeListener(this.handleProjectListChange);
  },

  handleProjectListChange: function() {
    this.setState({
      projectList: ProjectListStore.getProjectList(),
      isLoading: ProjectListStore.isLoading()
    });
  },

  handleNewProject: function(e) {
    e.preventDefault();
  }
});

module.exports = Project;
