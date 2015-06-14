"use strict";
var React = require("react")
var SigninPage = require("./SigninPage.jsx");
var ProjectListPage = require("./ProjectListPage.jsx");
var ProjectDetailPage = require("./ProjectDetailPage.jsx");
var PageStore = require("../stores/PageStore");

var Page = PageStore.Page;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      page: PageStore.getPage()
    };
  },
  render: function() {
    switch (this.state.page) {
      case Page.SIGNIN:
        return <SigninPage/>;
        break;
      case Page.PROJECT_LIST:
        return <ProjectListPage/>;
        break;
      case Page.PROJECT_DETAIL:
        return <ProjectDetailPage/>;
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
      page: PageStore.getPage()
    });
  }
});
