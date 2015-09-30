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
var moment = require("moment");
var moment_ja = require("moment/locale/ja");

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
          <Col xs={8} xsOffset={2}>
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
      var today = moment();
      today.hour(0);
      today.minute(0);
      today.second(0);
      var timelineList = this.state.timeline.map(function(projectMilestone) {
        // var href = this.makeHref("/project/" + project.id);
        var project = projectMilestone.getProject();
        var milestone = projectMilestone.getMilestone();
        var internalDate = projectMilestone.getInternalDate();
        var internalMoment = moment(internalDate);
        var dateString = projectMilestone.getDateString();
        if (dateString == "") {
          dateString = internalMoment.format("M/D");
        }

        return (
          <ListGroupItem key={"id_" + projectMilestone.id}>
            <Grid fluid>
              <Row>
                <Col xs={8}>
                  <strong>{project.getName()}</strong> <span>{project.getVersion()}</span> <Label bsStyle="warning">{project.getPlatform().getName()}</Label>
                </Col>
                <Col xs={4} className="text-right">
                  {internalMoment.from(today)}
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  {project.getProjectCode()}
                </Col>
                <Col xs={4} className="text-right">
                  {milestone.getName()}:{dateString}
                </Col>
              </Row>
            </Grid>
          </ListGroupItem>
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
