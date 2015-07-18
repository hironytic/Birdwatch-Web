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
var Modal = ReactBootstrap.Modal;
var moment = require("moment");

var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");

var ProjectDetailViewer = React.createClass({
  mixins: [ReactRouter.Navigation],

  getInitialState: function() {
    return {
      targetId: ProjectDetailStore.getTargetId(),
      project: ProjectDetailStore.getProject(),
      isLoading: ProjectDetailStore.isLoading(),
      milestones: ProjectDetailStore.getMilestones(),
      isMilestonesLoading: ProjectDetailStore.isMilestonesLoading(),
      isShowConfirmationToDelete: false,
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
          <FormControls.Static label="名称" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={project.getName()}/>
          <FormControls.Static label="プロジェクトコード" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={project.getProjectCode()}/>
          <FormControls.Static label="プロダクト" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={project.getFamily().getName()}/>
          <FormControls.Static label="OS" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={project.getPlatform().getName()}/>
          <FormControls.Static label="内部バージョン" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={project.getVersion()}/>
          <div className="form-group">
            <label className="col-sm-3 control-label">マイルストーン</label>
            <div className="col-sm-9">
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
            <Button key="delete" onClick={this.handleDelete}><Glyphicon glyph="trash"/> 削除</Button>
          </ButtonGroup>
        </ButtonToolbar>
      );
    }

    var confirmationToDelete = (
      <Modal show={this.state.isShowConfirmationToDelete} onHide={this.handleCancelDeleting}>
        <Modal.Header closeButton>
          <Modal.Title>プロジェクトの削除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(project == null) ? "" : (
            <div>
              <h4>{project.getName()}</h4>
            </div>
          )}
          <p>このプロジェクトを削除します。よろしいですか？</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.handleSurelyDelete}>削除</Button>
          <Button onClick={this.handleCancelDeleting}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <div>
        <Panel footer={footer}>
          {projectForm}
          {confirmationToDelete}
        </Panel>
      </div>
    );
  },

  renderMilestones: function() {
    var milestones = "";
    if (this.state.isMilestonesLoading) {
      milestones = (
        <tr>
          <td colSpan="3" className="col-xs-12">
            <div className="text-center">
              <img src="image/loading.gif"/>
            </div>
          </td>
        </tr>
      );
    } else if (this.state.milestones != null) {
      milestones = this.state.milestones.map(function(milestone) {
        var internalDate = milestone.getInternalDate();
        var internalMoment = moment(internalDate);
        var internalDateString = internalMoment.format("YYYY-MM-DD");
        var dateString = milestone.getDateString();
        if (dateString == "") {
          dateString = internalMoment.format("M/D");
        }
        return (
          <tr key={"id_" + milestone.id}>
            <td className="col-xs-4">{milestone.getMilestone().getName()}</td>
            <td className="col-xs-4">{internalDateString}</td>
            <td className="col-xs-4">{dateString}</td>
          </tr>
        );
      }.bind(this));
      milestones = milestones.toArray();
    }

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

  handleDelete: function(e) {
    this.setState({
      isShowConfirmationToDelete: true,
    });
  },

  handleSurelyDelete: function(e) {
    this.setState({
      isShowConfirmationToDelete: false,
    });
    ProjectDetailActionCreator.deleteProject(this.props.id).then(function() {
      this.transitionTo("/project");
    }.bind(this));
  },

  handleCancelDeleting: function(e) {
    this.setState({
      isShowConfirmationToDelete: false,
    });
  },
});

module.exports = ProjectDetailViewer;
