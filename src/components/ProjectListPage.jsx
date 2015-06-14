"use strict";
var React = require("react");
var NavBar = require("./NavBar.jsx");
var ProjectListStore = require("../stores/ProjectListStore");
var ProjectListActionCreator = require("../actions/ProjectListActionCreator");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      projectList: ProjectListStore.getProjectList()
    };
  },

  render: function() {
    var projectItems = this.state.projectList.map(function(project) {
      return (
        <tr key={project.id} onClick={this.handleItemClicked.bind(this, project.id)}>
          { /*<td style={{backgroundColor: "#eeccee"}}></td>*/ }
          <td>{project.getPlatform().getName()}</td>
          <td>{project.getName()}</td>
          <td>{project.getVersion()}</td>
          <td>{project.getProjectCode()}</td>
        </tr>
      );
    }.bind(this));

    return (
      <div>
        <NavBar title="プロジェクト一覧" />
        <div className="container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                {/* <th style={{width: "20px"}}></th> */}
                <th>OS</th>
                <th>名称</th>
                <th>内部バージョン</th>
                <th>プロジェクトコード</th>
              </thead>
              <tbody>
                {projectItems}
              </tbody>
            </table>
          </div>
        </div>
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
  },

  handleItemClicked: function(itemId) {
    ProjectListActionCreator.clickListItem(itemId);
  }
});
