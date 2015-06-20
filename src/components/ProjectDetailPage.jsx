"use strict";
var React = require("react");
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel;
var FormControls = ReactBootstrap.FormControls;
var HeaderBar = require("./HeaderBar.jsx");
var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");

var ProjectDetailPage = React.createClass({
  getInitialState: function() {
    return {
      project: ProjectDetailStore.getProject()
    };
  },

  render: function() {
    var projectPanel;
    var project = this.state.project;
    if (project == null) {
      projectPanel = <div/>
    } else {
      projectPanel = (
        <div className="container">
          <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
            <FormControls.Static label="名称" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getName()}/>
            <FormControls.Static label="プロジェクトコード" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getProjectCode()}/>
            <FormControls.Static label="プロダクト" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getFamily().getName()}/>
            <FormControls.Static label="OS" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getPlatform().getName()}/>
            <FormControls.Static label="内部バージョン" labelClassName="col-xs-4" wrapperClassName="col-xs-8" value={project.getVersion()}/>
{/*
            <div className="form-group">
              <label className="col-sm-4 control-label">マイルストーン</label>
              <div className="col-sm-8">
                <table className="table">
                  <thead>
                  </thead>
                  <tbody>
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
                  </tbody>
                </table>
              </div>
            </div>
*/}
          </form>
        </div>
      );
    }

    return (
      <div>
        <HeaderBar/>
        {projectPanel}
      </div>
    );
  },

  componentDidMount: function() {
    ProjectDetailStore.addProjectChangeListener(this.handleProjectChange);
    ProjectDetailActionCreator.loadProjectDetail(this.props.projectId);
  },

  componentWillUnmount: function() {
    ProjectDetailStore.removeProjectChangeListener(this.handleProjectChange);
    ProjectDetailActionCreator.unloadProjectDetail();
  },

  componentWillReceiveProps: function(nextProps) {
    setTimeout(function() {
      ProjectDetailActionCreator.loadProjectDetail(nextProps.projectId);
    }.bind(this), 1);
  },

  handleProjectChange: function() {
    this.setState({
      project: ProjectDetailStore.getProject()
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
  }
});

module.exports = ProjectDetailPage;
