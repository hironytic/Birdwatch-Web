"use strict";
var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    USER_SIGNING_IN: null,            // ユーザーがサインイン中になった
    USER_SIGNED_IN: null,             // ユーザーがサインインした
    USER_FAILED_TO_SIGN_IN: null,     // ユーザーのサインインに失敗
    USER_SIGNED_OUT: null,            // ユーザーがサインアウトした

    PROJECT_LIST_REFRESHED: null,     // プロジェクト一覧の更新
    PROJECT_LIST_ITEM_CLICKED: null,  // プロジェクト一覧のアイテムをクリック

    PROJECT_DETAIL_REFRESHED: null,   // プロジェクト詳細の更新
  })
};
