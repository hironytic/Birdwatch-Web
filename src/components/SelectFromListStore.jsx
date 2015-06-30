"use strict";
var React = require("react");
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var FormControls = ReactBootstrap.FormControls;

var SelectFromListStore = React.createClass({
  getInitialState: function() {
    var valueLink = this.getValueLink(this.props);
    return {
      list: this.props.listStore.getList(),
      isLoading: this.props.listStore.isLoading(),
      valueId: valueLink.value.id,
    };
  },

  render: function() {
    if (this.state.isLoading) {
      return (
        <FormControls.Static label={this.props.label}
                          labelClassName={this.props.labelClassName}
                          wrapperClassName={this.props.wrapperClassName}
                          value={(<img src="image/loading_small.gif"/>)}
                          />
      );
    }

    var options = this.state.list.map(function(item) {
      return <option value={item.id} key={"id_" + item.id}>{item.getName()}</option>;
    }.bind(this)).toArray();

    return (
      <Input type="select"
            label={this.props.label}
            labelClassName={this.props.labelClassName}
            wrapperClassName={this.props.wrapperClassName}
            value={this.state.valueId}
            onChange={this.handleSelectionChange}>
        {options}
      </Input>
    );
  },

  getValueLink: function(props) {
    if (props.valueLink) {
      return props.valueLink;
    } else {
      return {
        value: props.value,
        requestChange: props.onChange,
      };
    }
  },

  componentDidMount: function() {
    this.props.listStore.addChangeListener(this.handleListChange);
  },

  componentWillUnmount: function() {
    this.props.listStore.removeChangeListener(this.handleListChange);
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.listStore != nextProps.listStore) {
      this.props.listStore.removeChangeListener(this.handleListChange);
      nextProps.listStore.addChangeListener(this.handleListChange);
    }

    var valueLink = this.getValueLink(nextProps);
    if (this.state.valueId != valueLink.value.id) {
      this.setState({
        valueId: valueLink.value.id,
      });
    }
  },

  handleListChange: function() {
    this.setState({
      list: this.props.listStore.getList(),
      isLoading: this.props.listStore.isLoading(),
    });
  },

  handleSelectionChange: function(e) {
    var valueId = e.target.value;
    this.setState({
      valueId: valueId,
    });

    var valueLink = this.getValueLink(this.props);
    if (valueLink.requestChange) {
      var value = this.state.list.find(function(item) { return item.id == valueId; });
      valueLink.requestChange(value);
    }
  },
});

module.exports = SelectFromListStore;
