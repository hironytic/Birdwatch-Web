"use strict";
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Alert = ReactBootstrap.Alert;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

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
      return (
        <Alert key={error.id} bsStyle="danger" onDismiss={this.handleErrorDismiss.bind(this, error)}>
          {(error.message1) ? <h4>{error.message1}</h4> : ""}
          {(error.message2) ? <p>{error.message2}</p> : ""}
        </Alert>
      );
    }.bind(this)).toArray();

    var clearAllErrors = "";
    if (this.state.errorList.count() > 1) {
      clearAllErrors = <Panel bsStyle="danger"><Button bsStyle="danger" className="pull-right" onClick={this.handleClearAllErrors}><Glyphicon glyph='remove'/> すべてのエラーを消去</Button></Panel>;
    }

    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            {errorAlerts}
            {clearAllErrors}
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
  },

  handleClearAllErrors: function() {
    ErrorActionCreator.clearAllErrors();
  }
});

module.exports = ErrorList;
