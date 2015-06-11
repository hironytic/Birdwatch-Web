Parse.initialize("(applicationId)", "(javaScriptKey)");

var React = require('react')
var MainContent = require('./main-content.jsx')

React.render(<MainContent />, document.getElementById('main-content'));
