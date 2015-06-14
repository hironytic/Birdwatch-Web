"use strict";
var AppConstants = require("../constants/AppConstants")
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var keyMirror = require('react/lib/keyMirror');
var CurrentUserStore = require("./CurrentUserStore");

var ActionTypes = AppConstants.ActionTypes;
var Page = AppConstants.Page;
var EventType = keyMirror({
  PAGE_CHANGE: null
});

var _page;
var resolvePage = function() {
  // 認証されていなければサインインページ
  if (CurrentUserStore.getUser() == null) {
    _page = Page.SIGNIN;
    return;
  }

  var fragment = "";
  var url = window.location.href;
  var fragmentIx = url.indexOf("#");
  if (fragmentIx >= 0) {
    fragment = url.substring(fragmentIx + 1);
  }

  if (fragment == "") {
    _page = Page.PROJECT_LIST;
  } else {
    // TODO: fragmentの/以下はパラメータとして扱う
    _page = fragment;
  }
}
resolvePage();

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
    case ActionTypes.PAGE_CHANGED:
      resolvePage();
      PageStore.emitPageChange();
      break;
  }
});

module.exports = PageStore;
