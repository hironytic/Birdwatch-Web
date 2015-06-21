"use strict";
var React = require("react")
var AppConstants = require("../constants/AppConstants");
//var SigninPage = require("./SigninPage.jsx");
var ProjectListPage = require("./ProjectListPage.jsx");
var ProjectDetailPage = require("./ProjectDetailPage.jsx");
var PageStore = require("../stores/PageStore");

var Page = AppConstants.Page;

var MainContent = React.createClass({
  getInitialState: function() {
    return {
      page: PageStore.getPage(),
      parameter: PageStore.getParameter()
    };
  },
  render: function() {
    switch (this.state.page) {
      // case Page.SIGNIN:
      //   return <SigninPage/>;
      //   break;
      case Page.PROJECT_LIST:
        return <ProjectListPage/>;
        break;
      case Page.PROJECT_DETAIL:
        return <ProjectDetailPage projectId={this.state.parameter}/>;
        break;

      default:
        return (<div/>);
    }
  },
  componentDidMount: function() {
    PageStore.addPageChangeListener(this.handlePageChange);
  },
  componentWillUnmount: function() {
    PageStore.removePageChangeListener(this.handlePageChange);
  },

  handlePageChange: function() {
    this.setState({
      page: PageStore.getPage(),
      parameter: PageStore.getParameter()
    });
  }
});

module.exports = MainContent;
