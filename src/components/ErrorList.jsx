"use strict";
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Alert = ReactBootstrap.Alert;

var ErrorStore = require("../stores/ErrorStore");
var ErrorActionCreator = require("../actions/ErrorActionCreator");

var ErrorList = React.createClass({
  getInitialState: function() {
    return {
      errorList: ErrorStore.getErrorList()
    };
  },

  render: function() {
    if (this.state.errorList.isEmpty()) {
      return <div/>;
    }

    var errorAlerts = this.state.errorList.map(function(error) {
      var messages = [];
      if (error.message1) {
        messages.push(<h4>{error.message1}</h4>);
      }
      if (error.message2) {
        messages.push(<p>{error.message2}</p>);
      }
      return (
        <Alert key={error.id} bsStyle="danger" onDismiss={this.handleErrorDismiss.bind(this, error)}>{messages}</Alert>
      );
    }.bind(this)).toArray();

    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            {errorAlerts}
          </Col>
        </Row>
      </Grid>
    );
  },

  componentDidMount: function() {
    ErrorStore.addChangeListener(this.handleErrorListChange);
  },

  componentWillUnmount: function() {
    ErrorStore.removeChangeListener(this.handleErrorListChange);
  },

  handleErrorListChange: function() {
    this.setState({
      errorList: ErrorStore.getErrorList()
    });
  },

  handleErrorDismiss: function(error) {
    ErrorActionCreator.clearError(error.id);
  }
});

module.exports = ErrorList;
