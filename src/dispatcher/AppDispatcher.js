"use strict";
var Dispatcher = require('flux').Dispatcher

var AppDispatcher = new Dispatcher();

// for Debug
// AppDispatcher.dispatch = function(action) {
//   console.log(action);
//   Dispatcher.prototype.dispatch.apply(AppDispatcher, arguments);
// };

module.exports = AppDispatcher;
