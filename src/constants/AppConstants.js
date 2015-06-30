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

    PROJECT_DETAIL_TARGET: null,              // プロジェクト詳細の対象が決まった
    PROJECT_DETAIL_LOADING: null,             // プロジェクト詳細のロード中
    PROJECT_DETAIL_LOADED: null,              // プロジェクト詳細のロード完了
    PROJECT_DETAIL_MILESTONES_LOADING: null,  // プロジェクト詳細のマイルストーンのロード中
    PROJECT_DETAIL_MILESTONES_LOADED: null,   // プロジェクト詳細のマイルストーンのロード完了
    PROJECT_DETAIL_START_EDITING: null,       // プロジェクト詳細の編集開始
    PROJECT_DETAIL_CANCEL_EDITING: null,      // プロジェクト詳細の編集をキャンセル

    FAMILY_LIST_LOADING: null,        // 製品ファミリ一覧のロード中
    FAMILY_LIST_LOADED: null,         // 製品ファミリ一覧のロード完了

    PLATFORM_LIST_LOADING: null,      // プラットフォーム一覧のロード中
    PLATFORM_LIST_LOADED: null,       // プラットフォーム一覧のロード完了
  }),
};
