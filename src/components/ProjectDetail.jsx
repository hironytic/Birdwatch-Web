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

var ProjectDetail = React.createClass({
  mixins: [ReactRouter.TransitionHook],

  getInitialState: function() {
    return {
      project: ProjectDetailStore.getProject(),
      isLoading: ProjectDetailStore.isLoading(),
      isEditing: ProjectDetailStore.isEditing()
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
      if (this.state.isEditing) {
        footer = (
          <ButtonToolbar>
            <ButtonGroup>
              <Button key="editingDone" bsStyle="primary"><Glyphicon glyph="ok"/> 完了</Button>
              <Button key="editingCancel" onClick={this.handleCancelEditing}><Glyphicon glyph="remove"/> キャンセル</Button>
            </ButtonGroup>
          </ButtonToolbar>
        );
      } else {
        footer = (
          <ButtonToolbar>
            <ButtonGroup>
              <Button key="refresh" onClick={this.handleRefresh}><Glyphicon glyph="refresh"/> 最新に更新</Button>
              <Button key="startEditing" onClick={this.handleStartEditing}><Glyphicon glyph="pencil"/> 編集</Button>
              <Button key="delete"><Glyphicon glyph="trash"/> 削除</Button>
            </ButtonGroup>
          </ButtonToolbar>
        );
      }
    }

    return (
      <Panel footer={footer}>
        {projectForm}
      </Panel>
    );
  },

  renderMilestones: function() {
    return (
      <Table condensed>
        <thead>
          <tr>
            <th>イベント</th>
            <th>表示</th>
            <th>日付</th>
          </tr>
        </thead>
        <tbody>
{/*
          <tr>
            <td>開発終了</td>
            <td>6月</td>
            <td>(2015/06/01)</td>
          </tr>
          <tr>
            <td>コードFix</td>
            <td>6/14</td>
            <td>(2015/06/14)</td>
          </tr>
*/}
        </tbody>
      </Table>
    );
  },

  componentDidMount: function() {
    ProjectDetailStore.addProjectChangeListener(this.handleProjectChange);
    ProjectDetailStore.addEditingChangeListener(this.handleEditingChange);
    setTimeout(function() {
      ProjectDetailActionCreator.loadProjectDetail(this.props.params.id);
    }.bind(this), 0);
  },

  componentWillUnmount: function() {
    ProjectDetailStore.removeProjectChangeListener(this.handleProjectChange);
    ProjectDetailStore.removeEditingChangeListener(this.handleEditingChange);
  },

  componentWillReceiveProps: function(nextProps) {
    setTimeout(function() {
      ProjectDetailActionCreator.loadProjectDetail(nextProps.params.id);
    }.bind(this), 1);
  },

  handleProjectChange: function() {
    this.setState({
      project: ProjectDetailStore.getProject(),
      isLoading: ProjectDetailStore.isLoading()
    });
  },

  handleEditingChange: function() {
    this.setState({
      isEditing: ProjectDetailStore.isEditing()
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleRefresh: function(e) {
    ProjectDetailActionCreator.loadProjectDetail(this.props.params.id);
  },

  handleStartEditing: function(e) {
    ProjectDetailActionCreator.startEditing(this.props.params.id);
  },

  handleCancelEditing: function(e) {
    ProjectDetailActionCreator.cancelEditing(this.props.params.id);
  },

  routerWillLeave: function(nextState, router) {
    console.log("leave");
  }
});

module.exports = ProjectDetail;
