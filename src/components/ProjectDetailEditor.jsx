"use strict";
var React = require("react/addons");
var ReactRouter = require("react-router");
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var FormControls = ReactBootstrap.FormControls;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Immutable = require("immutable");
var moment = require("moment");
var Calendar = require("rc-calendar");
var DatePicker = Calendar.Picker;
var DateTimeFormat = require("gregorian-calendar-format");
var GregorianCalendar = require("gregorian-calendar");
var assign = require("object-assign");

var ProjectDetailStore = require("../stores/ProjectDetailStore");
var ProjectDetailActionCreator = require("../actions/ProjectDetailActionCreator");
var FamilyListStore = require("../stores/FamilyListStore");
var PlatformListStore = require("../stores/PlatformListStore");
var MilestoneListStore = require("../stores/MilestoneListStore");
var SelectFromListStore = require("./SelectFromListStore.jsx");

var FORMATTER = new DateTimeFormat("yyyy-MM-dd");

var ProjectDetailEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.TransitionHook],
  newPmID: 0,

  getInitialState: function() {
    var project = ProjectDetailStore.getProject();
    return {
      targetId: ProjectDetailStore.getTargetId(),

      name: (project == null) ? "" : project.getName(),
      projectCode: (project == null) ? "" : project.getProjectCode(),
      family: (project == null) ? null : project.getFamily(),
      platform: (project == null) ? null : project.getPlatform(),
      version: (project == null) ? "" : project.getVersion(),
      projectMilestones: ProjectDetailStore.getMilestones().map(function(projectMilestone) {
        return Immutable.Map({
          isNew: false,
          id: projectMilestone.id,
          milestone: projectMilestone.getMilestone(),
          internalDate: projectMilestone.getInternalDate(),
          dateString: projectMilestone.getDateString(),
        });
      }),
    };
  },

  render: function() {
    var projectForm = (
      <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
        <Input type="text" label="名称" labelClassName="col-xs-3" wrapperClassName="col-xs-9" valueLink={this.linkState('name')}/>
        <Input type="text" label="プロジェクトコード" labelClassName="col-xs-3" wrapperClassName="col-xs-9" valueLink={this.linkState('projectCode')}/>
        <SelectFromListStore label="プロダクト" labelClassName="col-xs-3" wrapperClassName="col-xs-9" listStore={FamilyListStore} valueLink={this.linkState('family')}/>
        <SelectFromListStore label="OS" labelClassName="col-xs-3" wrapperClassName="col-xs-9" listStore={PlatformListStore} valueLink={this.linkState('platform')}/>
        <Input type="text" label="内部バージョン" labelClassName="col-xs-3" wrapperClassName="col-xs-9" valueLink={this.linkState('version')}/>
        <div className="form-group">
          <label className="col-sm-3 control-label">マイルストーン</label>
          <div className="col-sm-9">
            {this.renderMilestones()}
          </div>
        </div>
      </form>
    );

    var footer = "";
    footer = (
      <ButtonToolbar>
        <ButtonGroup>
          <Button key="editingDone" onClick={this.handleCommitEditing} bsStyle="primary"><Glyphicon glyph="ok"/> 完了</Button>
          <Button key="editingCancel" onClick={this.handleCancelEditing}><Glyphicon glyph="remove"/> キャンセル</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );

    return (
      <Panel footer={footer}>
        {projectForm}
      </Panel>
    );
  },

  renderMilestones: function() {
    var locale = assign({}, require("gregorian-calendar/lib/locale/en-US"), {
      timezoneOffset: moment().utcOffset(),
    });

    var milestones = "";
    milestones = this.state.projectMilestones.map(function(projectMilestone, pmIdx) {
      var key;
      if (projectMilestone.get("isNew")) {
        key = "new_" + projectMilestone.get("id");
      } else {
        key = "id_" + projectMilestone.get("id");
      }
      var internalDate = projectMilestone.get("internalDate");
      var internalDateCal = new GregorianCalendar(locale);
      internalDateCal.setTime(internalDate.getTime());
      var calendar = <Calendar orient={['bottom', 'right']} showTime={false}/>;
      return (
        <tr key={key}>
          <td className="col-xs-1"><Button bsStyle="default" onClick={this.handleRemoveMilestone.bind(this, pmIdx)}><Glyphicon glyph='minus'/></Button></td>
          <td className="col-xs-4"><SelectFromListStore listStore={MilestoneListStore} value={projectMilestone.get("milestone")} onChange={this.handleMilestoneChange.bind(this, pmIdx)} standalone/></td>
          <td className="col-xs-4">
            <DatePicker ref='picker' formatter={FORMATTER} calendar={calendar} value={internalDateCal} onChange={this.handleInternalDateChange.bind(this, pmIdx)}>
              <input type="text" className="form-control" style={{background: 'white', cursor: 'pointer'}}/>
            </DatePicker>
          </td>
          <td className="col-xs-3"><Input type="text" value={projectMilestone.get("dateString")} onChange={this.handleDateStringChange.bind(this, pmIdx)} standalone/></td>
        </tr>
      );
    }.bind(this));
    milestones = milestones.toArray();

    return (
      <Table condensed>
        <thead>
          <tr>
            <th className="col-xs-1"></th>
            <th className="col-xs-4">イベント</th>
            <th className="col-xs-4">内部日付</th>
            <th className="col-xs-3">表示</th>
          </tr>
        </thead>
        <tbody>
          {milestones}
          <tr key="new">
            <td className="col-xs-12" colSpan="4">
              <Button block onClick={this.handleNewMilestone}><Glyphicon glyph='plus'/> 新しいマイルストーン</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  },

  handleMilestoneChange: function(pmIdx, milestone) {
    var projectMilestone = this.state.projectMilestones.get(pmIdx);
    projectMilestone = projectMilestone.set("milestone", milestone);
    var projectMilestones = this.state.projectMilestones.set(pmIdx, projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  handleInternalDateChange: function(pmIdx, value) {
    var internalDate = moment(value.getTime()).hours(0).minutes(0).seconds(0).toDate();
    var projectMilestone = this.state.projectMilestones.get(pmIdx);
    projectMilestone = projectMilestone.set("internalDate", internalDate);
    var projectMilestones = this.state.projectMilestones.set(pmIdx, projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  handleDateStringChange: function(pmIdx, e) {
    var projectMilestone = this.state.projectMilestones.get(pmIdx);
    projectMilestone = projectMilestone.set("dateString", e.target.value);
    var projectMilestones = this.state.projectMilestones.set(pmIdx, projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  handleNewMilestone: function() {
    this.newPmID = this.newPmID + 1;
    var id = this.newPmID.toString();
    var projectMilestone = Immutable.Map({
      isNew: true,
      id: id,
      milestone: MilestoneListStore.getList().first(),
      internalDate: moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(),
      dateString: "",
    });
    var projectMilestones = this.state.projectMilestones.push(projectMilestone);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  handleRemoveMilestone: function(pmIdx) {
    var projectMilestones = this.state.projectMilestones.remove(pmIdx);
    this.setState({
      projectMilestones: projectMilestones,
    });
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate: function(prevProps, prevState) {
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleCommitEditing: function(e) {
    var newValues = {
      name: this.state.name,
      projectCode: this.state.projectCode,
      family: this.state.family,
      platform: this.state.platform,
      version: this.state.version,
      projectMilestones: this.state.projectMilestones,
    };
    ProjectDetailActionCreator.commitEditing(this.state.targetId, newValues, this.state.projectMilestones);
  },

  handleCancelEditing: function(e) {
    ProjectDetailActionCreator.cancelEditing(this.props.id);
  },

  routerWillLeave: function(nextState, router) {
    console.log("leave");
  }
});

module.exports = ProjectDetailEditor;
