"use strict";
var React = require("react/addons");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var FormControls = ReactBootstrap.FormControls;
var Table = ReactBootstrap.Table;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");

var ProjectDetailViewer = React.createClass({
  getInitialState: function() {
    return {
      targetId: ProjectDetailStore.getTargetId(),
      project: ProjectDetailStore.getProject(),
      isLoading: ProjectDetailStore.isLoading(),
      milestones: ProjectDetailStore.getMilestones(),
      isMilestonesLoading: ProjectDetailStore.isMilestonesLoading(),
    };
  },

  render: function() {
    var projectForm;
    var project = this.state.project;
    if (project == null) {
      projectForm = "";
      if (this.state.isLoading) {
        projectForm = (
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        );
      }
    } else {
      projectForm = (
        <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
          <FormControls.Static label="名称" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getName()}/>
          <FormControls.Static label="プロジェクトコード" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getProjectCode()}/>
          <FormControls.Static label="プロダクト" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getFamily().getName()}/>
          <FormControls.Static label="OS" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getPlatform().getName()}/>
          <FormControls.Static label="内部バージョン" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getVersion()}/>
          <div className="form-group">
            <label className="col-sm-4 control-label">マイルストーン</label>
            <div className="col-sm-8">
              {this.renderMilestones()}
            </div>
          </div>
        </form>
      );
    }

    var footer = "";
    if (!this.state.isLoading) {
      footer = (
        <ButtonToolbar>
          <ButtonGroup>
            <Button key="refresh" onClick={this.handleRefresh}><Glyphicon glyph="refresh"/> 最新</Button>
            <Button key="startEditing" onClick={this.handleStartEditing}><Glyphicon glyph="pencil"/> 編集</Button>
            <Button key="delete"><Glyphicon glyph="trash"/> 削除</Button>
          </ButtonGroup>
        </ButtonToolbar>
      );
    }

    return (
      <Panel footer={footer}>
        {projectForm}
      </Panel>
    );
  },

  renderMilestones: function() {
    var milestones = "";
    if (this.state.isMilestonesLoading) {
      milestones = (
        <tr>
          <td colSpan="3">
            <div className="text-center">
              <img src="image/loading.gif"/>
            </div>
          </td>
        </tr>
      );
    } else if (this.state.milestones != null) {
      milestones = this.state.milestones.map(function(milestone) {
        var internalDate = milestone.getInternalDate();
        var internalDateString = internalDate.getFullYear().toString() + "-" +
                              ("0" + (internalDate.getMonth() + 1).toString()).slice(-2) + "-" +
                              ("0" + internalDate.getDay().toString()).slice(-2);
        if (internalDate.getHours() != 0 || internalDate.getMinutes() != 0 || internalDate.getSeconds() != 0) {
          internalDateString = internalDateString + " " +
                                ("0" + internalDate.getHours().toString()).slice(-2) + ":" +
                                ("0" + internalDate.getMinutes().toString()).slice(-2);
          if (internalDate.getSeconds() != 0) {
            internalDateString = internalDateString + ":" +
                                  ("0" + internalDate.getSeconds().toString()).slice(-2);
          }
        }
        internalDateString = "(" + internalDateString + ")";
        return (
          <tr key={"id_" + milestone.id}>
            <td>{milestone.getMilestone().getName()}</td>
            <td>{milestone.getDateString()}</td>
            <td>{internalDateString}</td>
          </tr>
        );
      }.bind(this));
      milestones = milestones.toArray();
    }

    return (
      <Table condensed>
        <thead>
          <tr>
            <th>イベント</th>
            <th>表示</th>
            <th>内部日付</th>
          </tr>
        </thead>
        <tbody>
          {milestones}
        </tbody>
      </Table>
    );
  },

  componentDidMount: function() {
    ProjectDetailStore.addProjectChangeListener(this.handleProjectChange);

    setTimeout(this.readyProject, 0);
  },

  componentWillUnmount: function() {
    ProjectDetailStore.removeProjectChangeListener(this.handleProjectChange);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.id != this.props.id) {
      setTimeout(this.readyProject, 0);
    }
  },

  readyProject: function() {
    if (this.state.targetId != this.props.id) {
      ProjectDetailActionCreator.setProjectTarget(this.props.id);
    }
    if ((this.state.project == null || this.state.project.id != this.props.id) && !this.state.isLoading) {
      ProjectDetailActionCreator.loadProjectDetail(this.props.id);
    }
  },

  handleProjectChange: function() {
    this.setState({
      targetId: ProjectDetailStore.getTargetId(),
      project: ProjectDetailStore.getProject(),
      isLoading: ProjectDetailStore.isLoading(),
      milestones: ProjectDetailStore.getMilestones(),
      isMilestonesLoading: ProjectDetailStore.isMilestonesLoading(),
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleRefresh: function(e) {
    ProjectDetailActionCreator.loadProjectDetail(this.props.id);
  },

  handleStartEditing: function(e) {
    ProjectDetailActionCreator.startEditing(this.props.id);
  },
});

module.exports = ProjectDetailViewer;
