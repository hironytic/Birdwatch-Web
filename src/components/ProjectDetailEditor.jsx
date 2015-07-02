"use strict";
var React = require("react/addons");
var ReactRouter = require("react-router");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var FormControls = ReactBootstrap.FormControls;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Immutable = require("immutable");

var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");
var FamilyListStore = require("../stores/FamilyListStore");
var PlatformListStore = require("../stores/PlatformListStore");
var MilestoneListStore = require("../stores/MilestoneListStore");
var SelectFromListStore = require("./SelectFromListStore.jsx");

var ProjectDetailEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.TransitionHook],

  getInitialState: function() {
    var project = ProjectDetailStore.getProject();
    return {
      targetId: ProjectDetailStore.getTargetId(),
      project: project,

      name: (project == null) ? "" : project.getName(),
      projectCode: (project == null) ? "" : project.getProjectCode(),
      family: (project == null) ? null : project.getFamily(),
      platform: (project == null) ? null : project.getPlatform(),
      version: (project == null) ? "" : project.getVersion(),
      projectMilestones: ProjectDetailStore.getMilestones().map(function(projectMilestone) {
        return Immutable.Map({
          id: projectMilestone.id,
          milestone: projectMilestone.getMilestone(),
          internalDate: projectMilestone.getInternalDate(),
          dateString: projectMilestone.getDateString(),
        });
      }),
    };
  },

  render: function() {
    var projectForm;
    var project = this.state.project;
    projectForm = (
      <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
        <Input type="text" label="名称" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('name')}/>
        <Input type="text" label="プロジェクトコード" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('projectCode')}/>
        <SelectFromListStore label="プロダクト" labelClassName="col-xs-4" wrapperClassName="col-xs-8" listStore={FamilyListStore} valueLink={this.linkState('family')}/>
        <SelectFromListStore label="OS" labelClassName="col-xs-4" wrapperClassName="col-xs-8" listStore={PlatformListStore} valueLink={this.linkState('platform')}/>
        <Input type="text" label="内部バージョン" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('version')}/>
        <div className="form-group">
          <label className="col-sm-4 control-label">マイルストーン</label>
          <div className="col-sm-8">
            {this.renderMilestones()}
          </div>
        </div>
      </form>
    );

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
    milestones = this.state.projectMilestones.map(function(projectMilestone, pmIdx) {
      var internalDate = projectMilestone.get("internalDate");
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
        <tr key={"id_" + projectMilestone.get("id")}>
          <td className="col-xs-4"><SelectFromListStore listStore={MilestoneListStore} value={projectMilestone.get("milestone")} onChange={this.handleMilestoneChange.bind(this, pmIdx)} standalone/></td>
          <td className="col-xs-4"><Input type="text" value={internalDateString} standalone/></td>
          <td className="col-xs-4"><Input type="text" value={projectMilestone.get("dateString")} onChange={this.handleDateStringChange.bind(this, pmIdx)} standalone/></td>
        </tr>
      );
    }.bind(this));
    milestones = milestones.toArray();

    return (
      <Table condensed>
        <thead>
          <tr>
            <th className="col-xs-4">イベント</th>
            <th className="col-xs-4">内部日付</th>
            <th className="col-xs-4">表示</th>
          </tr>
        </thead>
        <tbody>
          {milestones}
        </tbody>
      </Table>
    );
  },

  handleMilestoneChange: function(pmIdx, milestone) {
    var projectMilestone = this.state.projectMilestones.get(pmIdx);
    projectMilestone = projectMilestone.set("milestone", milestone);
    var projectMilestones = this.state.projectMilestones.set(pmIdx, projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  handleDateStringChange: function(pmIdx, e) {
    var projectMilestone = this.state.projectMilestones.get(pmIdx);
    projectMilestone = projectMilestone.set("dateString", e.target.value);
    var projectMilestones = this.state.projectMilestones.set(pmIdx, projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
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
