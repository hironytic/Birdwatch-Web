"use strict";
var React = require("react");
var NavBar = require("./NavBar.jsx");
var ProjectStore = require("../stores/ProjectStore");
var ProjectActionCreator = require("../actions/ProjectActionCreator");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      projectList: ProjectStore.getProjectList()
    };
  },

  render: function() {
    var projectItems = this.state.projectList.map(function(project) {
      return (
        <tr key={project.id}>
          { /*<td style={{backgroundColor: "#eeccee"}}></td>*/ }
          <td>{project.getName()}</td>
          <td>{project.getProjectCode()}</td>
        </tr>
      );
    });

    return (
      <div>
        <NavBar title="プロジェクト一覧" />
        <div className="container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                {/* <th style={{width: "20px"}}></th> */}
                <th>Name</th>
                <th>Project Code</th>
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
    ProjectStore.addProjectListChangeListener(this.handleProjectListChange);
    ProjectActionCreator.refreshList();
  },

  componentWillUnmount: function() {
    ProjectStore.removeProjectListChangeListener(this.handleProjectListChange);
  },

  handleProjectListChange: function() {
    this.setState({
      projectList: ProjectStore.getProjectList()
    });
  }
});
