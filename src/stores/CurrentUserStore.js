var AppConstants = require("../constants/appconstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require('react/lib/keyMirror');

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  STATUS_CHANGE: null,
  USER_CHANGE: null
});
var StatusType = keyMirror({
  NOT_SIGNED_IN: null,
  SIGNING_IN: null,
  SIGNED_IN: null,
  FAILED_TO_SIGN_IN: null
});

var _user = Parse.User.current();
var _status = (_user == null) ? StatusType.NOT_SIGNED_IN : StatusType.SIGNED_IN;

var CurrentUserStore = assign({}, EventEmitter.prototype, {
  emitUserChange: function() {
    this.emit(EventType.USER_CHANGE);
  },

  addUserChangeListener: function(callback) {
    this.addListener(EventType.USER_CHANGE, callback);
  },

  removeUserChangeListener: function(callback) {
    this.removeListener(EventType.USER_CHANGE, callback);
  },

  getUser: function() {
    return _user;
  },

  emitStatusChange: function() {
    this.emit(EventType.STATUS_CHANGE);
  },

  addStatusChangeListener: function(callback) {
    this.addListener(EventType.STATUS_CHANGE, callback);
  },

  removeStatusChangeListener: function(callback) {
    this.removeListener(EventType.STATUS_CHANGE, callback);
  },

  getStatus : function() {
    return _status;
  }
});

CurrentUserStore.StatusType = StatusType;

CurrentUserStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.USER_SIGNING_IN:
      _status = StatusType.SIGNING_IN;
      CurrentUserStore.emitStatusChange();
      break;
    case ActionTypes.USER_SIGNED_IN:
      _status = StatusType.SIGNED_IN;
      CurrentUserStore.emitStatusChange();
      _user = action.user;
      CurrentUserStore.emitUserChange();
      break;
    case ActionTypes.USER_FAILED_TO_SIGN_IN:
      _status = StatusType.FAILED_TO_SIGN_IN;
      CurrentUserStore.emitStatusChange();
      _user = null;
      CurrentUserStore.emitUserChange();
      break;
    case ActionTypes.USER_SIGNED_OUT:
      _status = StatusType.NOT_SIGNED_IN;
      CurrentUserStore.emitStatusChange();
      _user = null;
      CurrentUserStore.emitUserChange();
      break;
  }
});

module.exports = CurrentUserStore;
