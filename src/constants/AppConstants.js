"use strict";
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    USER_SIGNING_IN: null,            // ユーザーがサインイン中になった
    USER_SIGNED_IN: null,             // ユーザーがサインインした
    USER_FAILED_TO_SIGN_IN: null,     // ユーザーのサインインに失敗
    USER_SIGNED_OUT: null,            // ユーザーがサインアウトした

    PROJECT_LIST_REFRESHED: null,     // プロジェクト一覧の更新

    PROJECT_DETAIL_LOADED: null,      // プロジェクト詳細のロード完了
    PROJECT_DETAIL_UNLOAD: null,      // プロジェクト詳細のアンロード
  }),

  Page: {
    SIGNIN: "signin",
    PROJECT_LIST: "projects",
    PROJECT_DETAIL: "project"
  }
};
