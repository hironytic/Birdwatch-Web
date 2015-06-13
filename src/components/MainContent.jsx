"use strict";
var React = require("react")
var SigninPage = require("./SigninPage.jsx");
var ProjectsPage = require("./ProjectsPage.jsx");
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
        return (<SigninPage/>);
        break;
      case Page.PROJECTS:
        return (<ProjectsPage/>);
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
