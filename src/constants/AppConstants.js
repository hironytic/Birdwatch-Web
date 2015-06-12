var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ActionTypes: keyMirror({
    USER_SIGNING_IN: null,
    USER_SIGNED_IN: null,
    USER_FAILED_TO_SIGN_IN: null,
    USER_SIGNED_OUT: null,
  })
};
