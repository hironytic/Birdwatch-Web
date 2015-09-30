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
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Label = ReactBootstrap.Label;

var ProjectListStore = require("../stores/ProjectListStore");
var ProjectListActionCreator = require("../actions/ProjectListActionCreator");
var NewProjectModal = require("./NewProjectModal.jsx");

var Project = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],

  getInitialState: function() {
    return {
      projectList: ProjectListStore.getProjectList(),
      isLoading: ProjectListStore.isLoading(),
      isShowNewProjectModal: false,
    };
  },

  render: function() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={4}>
              <Panel header="プロジェクト" bsStyle="info" style={{height: "512"}} footer={this.renderFooter()}>
                {this.renderProjectList()}
              </Panel>
            </Col>
            <Col xs={8}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
        <NewProjectModal isShow={this.state.isShowNewProjectModal} onFinish={this.handleNewProjectModalFinish}/>
      </div>
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
      projectItems = this.state.projectList.sortBy(function(project) {
        return (project.getName() + " " + project.getPlatform().getName() + project.getVersion() + " ").toLowerCase();
      }).map(function(project) {
        // var href = this.makeHref("/project/" + project.id);
        var href = "#/project/" + project.id;
        var isActive = this.isActive("/project/" + project.id);
        var header = (
          <span><strong>{project.getName()}</strong> <span>{project.getVersion()}</span> <Label bsStyle="warning">{project.getPlatform().getName()}</Label></span>
        );
        return (
          <ListGroupItem key={"id_" + project.id} active={isActive} href={href} header={header}>{project.getProjectCode()}</ListGroupItem>
        );
      }.bind(this)).toArray();
    }

    return (
      <ListGroup fill style={{height: "469", "overflowY": "auto"}}>
        {projectItems}
      </ListGroup>
    );
  },

  renderFooter: function() {
    if (true) {
      return (
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.handleNewProject}><Glyphicon glyph="plus"/> 新規プロジェクト</Button>
          </ButtonGroup>
        </ButtonToolbar>
      );
    } else {
      return "";
    }
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
    this.setState({
      isShowNewProjectModal: true,
    });
  },

  handleNewProjectModalFinish: function(data) {
    this.setState({
      isShowNewProjectModal: false,
    });

    if (data != null) {
      ProjectListActionCreator.createNewProject(data).then(function(projectId) {
        if (projectId != null) {
          this.transitionTo("/project/" + projectId);
        }
      }.bind(this));
    }
  }
});

module.exports = Project;
