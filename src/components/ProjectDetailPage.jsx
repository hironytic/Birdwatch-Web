"use strict";
var React = require("react");
var NavBar = require("./NavBar.jsx");
var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");

module.exports = React.createClass({
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
            <div className="form-group">
              <label className="col-sm-4 control-label">名称</label>
              <div className="col-sm-8">
                <p className="form-control-static">{project.getName()}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">プロジェクトコード</label>
              <div className="col-sm-8">
                <p className="form-control-static">{project.getProjectCode()}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">プロダクト</label>
              <div className="col-sm-8">
                <p className="form-control-static">{project.getFamily().getName()}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">OS</label>
              <div className="col-sm-8">
                <p className="form-control-static">{project.getPlatform().getName()}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">内部バージョン</label>
              <div className="col-sm-8">
                <p className="form-control-static">{project.getVersion()}</p>
              </div>
            </div>
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
        <NavBar title="プロジェクト詳細" />
        {projectPanel}
      </div>
    );
  },

  componentDidMount: function() {
    ProjectDetailStore.addProjectChangeListener(this.handleProjectChange);
    setTimeout(function() {
      ProjectDetailActionCreator.loadProjectDetail(this.props.projectId);
    }.bind(this), 1);
  },

  componentWillUnmount: function() {
    ProjectDetailStore.removeProjectChangeListener(this.handleProjectChange);
    setTimeout(function() {
      ProjectDetailActionCreator.unloadProjectDetail();
    }.bind(this), 1);
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
