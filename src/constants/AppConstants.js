"use strict";
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    PAGE_CHANGED: null,               // ページが変更された

    USER_SIGNING_IN: null,            // ユーザーがサインイン中になった
    USER_SIGNED_IN: null,             // ユーザーがサインインした
    USER_FAILED_TO_SIGN_IN: null,     // ユーザーのサインインに失敗
    USER_SIGNED_OUT: null,            // ユーザーがサインアウトした

    PROJECT_LIST_REFRESHED: null,     // プロジェクト一覧の更新
    PROJECT_LIST_SHOW_DETAIL: null,   // プロジェクト一覧での詳細表示要求

    PROJECT_DETAIL_REFRESHING: null,  // プロジェクト詳細の更新開始
    PROJECT_DETAIL_REFRESHED: null,   // プロジェクト詳細の更新
  }),

  Page: {
    SIGNIN: "signin",
    PROJECT_LIST: "projects",
    PROJECT_DETAIL: "project"
  }
};
