var AppConstants = require("../constants/appconstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require('react/lib/keyMirror');
var CurrentUserStore = require("./CurrentUserStore");

var ActionTypes = AppConstants.ActionTypes;
var EventType = keyMirror({
  PAGE_CHANGE: null
});
var Page = keyMirror({
  SIGNIN: null,
  PROJECTS: null
});

var _page;
if (CurrentUserStore.getUser() == null) {
  _page = Page.SIGNIN;
} else {
  _page = Page.PROJECTS;
}

var PageStore = assign({}, EventEmitter.prototype, {
  emitPageChange: function() {
    this.emit(EventType.PAGE_CHANGE);
  },

  addPageChangeListener: function(callback) {
    this.addListener(EventType.PAGE_CHANGE, callback);
  },

  removePageChangeListener: function(callback) {
    this.removeListener(EventType.PAGE_CHANGE, callback);
  },

  getPage: function() {
    return _page;
  }
});

PageStore.Page = Page;

PageStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.USER_SIGNED_IN:
      AppDispatcher.waitFor([CurrentUserStore.dispatchToken]);
      _page = Page.PROJECTS;
      PageStore.emitPageChange();
      break;
    case ActionTypes.USER_SIGNED_OUT:
      AppDispatcher.waitFor([CurrentUserStore.dispatchToken]);
      _page = Page.SIGNIN;
      PageStore.emitPageChange();
      break;
  }
});

module.exports = PageStore;
