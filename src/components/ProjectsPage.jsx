var React = require("react");
var NavBar = require("./NavBar.jsx");
var ProjectStore = require("../stores/ProjectStore");
var ProjectKey = require("../constants/ProjectKey");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      projects: ProjectStore.getProjects()
    };
  },
  render: function() {
    var projectItems = this.state.projects.map(function(project) {
      return (
        <tr key={project[ProjectKey.OBJECT_ID]}>
          { /*<td style={{backgroundColor: "#eeccee"}}></td>*/ }
          <td>{project[ProjectKey.NAME]}</td>
          <td>{project[ProjectKey.PROJECT_CODE]}</td>
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
  }
});
