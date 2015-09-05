"use strict";
var React = require("react/addons");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Label = ReactBootstrap.Label;

var TimelineStore = require("../stores/TimelineStore");
var TimelineActionCreator = require("../actions/TimelineActionCreator");

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      timeline: TimelineStore.getTimeline(),
      isLoading: TimelineStore.isLoading(),
    };
  },

  render: function() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <ListGroup>
                {this.renderTimelineList()}
            </ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  },

  renderTimelineList: function() {
    if (this.state.isLoading) {
      return (
        <ListGroupItem key="loading">
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        </ListGroupItem>
      );
    } else {
      var timelineList = this.state.timeline.map(function(projectMilestone) {
        // var href = this.makeHref("/project/" + project.id);
        var project = projectMilestone.getProject();
        var milestone = projectMilestone.getMilestone();
        var header = (
          <span><strong>{project.getName()}</strong> <Label bsStyle="warning">{project.getPlatform().getName()}</Label></span>
        );
        return (
          <ListGroupItem key={"id_" + projectMilestone.id} header={header}>{project.getProjectCode() + milestone.getName()}</ListGroupItem>
        );
      }.bind(this)).toArray();
      return timelineList;
    }
  },

  componentDidMount: function() {
    TimelineStore.addChangeListener(this.handleTimelineChange);
    setTimeout(function() {
      TimelineActionCreator.loadTimeline();
    }.bind(this), 0);
  },

  componentWillUnmount: function() {
    TimelineStore.removeChangeListener(this.handleTimelineChange);
  },

  handleTimelineChange: function() {
    this.setState({
      timeline: TimelineStore.getTimeline(),
      isLoading: TimelineStore.isLoading(),
    });
  },
});

module.exports = Timeline;
