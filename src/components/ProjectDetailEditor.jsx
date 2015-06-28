"use strict";
var React = require("react/addons");
var ReactRouter = require("react-router");
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

var ProjectDetailEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.TransitionHook],

  getInitialState: function() {
    var project = ProjectDetailStore.getProject();
    return {
      targetId: ProjectDetailStore.getTargetId(),
      project: project,
      isLoading: ProjectDetailStore.isLoading(),
      milestones: ProjectDetailStore.getMilestones(),
      isMilestonesLoading: ProjectDetailStore.isMilestonesLoading(),
      isEditing: ProjectDetailStore.isEditing(),

      name: (project == null) ? "" : project.getName(),
      projectCode: (project == null) ? "" : project.getProjectCode(),
      family: (project == null) ? null : project.getFamily(),
      platform: (project == null) ? null : project.getPlatform(),
      version: (project == null) ? "" : project.getVersion(),
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
    footer = (
      <ButtonToolbar>
        <ButtonGroup>
          <Button key="editingDone" bsStyle="primary"><Glyphicon glyph="ok"/> 完了</Button>
          <Button key="editingCancel" onClick={this.handleCancelEditing}><Glyphicon glyph="remove"/> キャンセル</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );

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
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate: function(prevProps, prevState) {
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleCancelEditing: function(e) {
    ProjectDetailActionCreator.cancelEditing(this.props.id);
  },

  routerWillLeave: function(nextState, router) {
    console.log("leave");
  }
});

module.exports = ProjectDetailEditor;