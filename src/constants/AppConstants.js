"use strict";
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    ERROR_OCCURED: null,              // エラーが発生した
    ERROR_CLEARED: null,              // エラーを消した
    ERROR_ALL_CLEARED: null,          // すべてのエラーを消した

    USER_SIGNING_IN: null,            // ユーザーがサインイン中になった
    USER_SIGNED_IN: null,             // ユーザーがサインインした
    USER_FAILED_TO_SIGN_IN: null,     // ユーザーのサインインに失敗
    USER_SIGNED_OUT: null,            // ユーザーがサインアウトした

    PROJECT_LIST_LOADING: null,       // プロジェクト一覧のロード中
    PROJECT_LIST_LOADED: null,        // プロジェクト一覧のロード完了

    PROJECT_DETAIL_LOADING: null,     // プロジェクト詳細のロード中
    PROJECT_DETAIL_LOADED: null,      // プロジェクト詳細のロード完了
  }),

  Page: {
    SIGNIN: "signin",
    PROJECT_LIST: "projects",
    PROJECT_DETAIL: "project"
  }
};
