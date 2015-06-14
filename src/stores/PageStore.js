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
var _parameter;
var resolvePage = function() {
  // 認証されていなければサインインページ
  if (CurrentUserStore.getUser() == null) {
    _page = Page.SIGNIN;
    _parameter = null;
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
    _parameter = null;
  } else {
    // fragmentの/以下はパラメータとして扱う
    var paramIx = fragment.indexOf("/");
    if (paramIx >= 0) {
      _page = fragment.substring(0, paramIx);
      _parameter = fragment.substring(paramIx + 1);
      // FIXME: decode parameter
    } else {
      _page = fragment;
      _parameter = null;
    }
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
  },

  getParameter: function() {
    return _parameter;
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
