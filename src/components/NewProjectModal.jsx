"use strict";
var React = require("react/addons");
var ReactBootstrap = require('react-bootstrap');
var FormControls = ReactBootstrap.FormControls;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

var FamilyListStore = require("../stores/FamilyListStore");
var PlatformListStore = require("../stores/PlatformListStore");
var SelectFromListStore = require("./SelectFromListStore.jsx");

var NewProjectModal = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      name: "",
      projectCode: "",
      family: FamilyListStore.getList().first(),
      platform: PlatformListStore.getList().first(),
      version: "",
    };
  },

  render: function() {
    return (
      <Modal show={this.props.isShow} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>新規プロジェクト</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="container-fluid">
            <div class="row">
              <form className="form-horizontal" action="#" onSubmit={this.handleSubmit}>
                <Input type="text" label="名称" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('name')}/>
                <Input type="text" label="プロジェクトコード" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('projectCode')}/>
                <SelectFromListStore label="プロダクト" labelClassName="col-xs-4" wrapperClassName="col-xs-8" listStore={FamilyListStore} valueLink={this.linkState('family')}/>
                <SelectFromListStore label="OS" labelClassName="col-xs-4" wrapperClassName="col-xs-8" listStore={PlatformListStore} valueLink={this.linkState('platform')}/>
                <Input type="text" label="内部バージョン" labelClassName="col-xs-4" wrapperClassName="col-xs-8" valueLink={this.linkState('version')}/>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleCreate}>作成</Button>
          <Button onClick={this.handleCancel}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    // 非表示から表示に変わるときに中身をクリア
    if (!this.props.isShow && nextProps.isShow) {
      this.setState({
        name: "",
        projectCode: "",
        family: FamilyListStore.getList().first(),
        platform: PlatformListStore.getList().first(),
        version: "",
      });
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  handleCancel: function(e) {
    if (this.props.onFinish) {
      this.props.onFinish(null);
    }
  },

  handleCreate: function(e) {
    if (this.props.onFinish) {
      this.props.onFinish({
        name: this.state.name,
        projectCode: this.state.projectCode,
        family: this.state.family,
        platform: this.state.platform,
        version: this.state.version,
      });
    }
  },
});

module.exports = NewProjectModal;
