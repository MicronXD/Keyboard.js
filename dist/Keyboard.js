(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Keyboard = require('../');

},{"../":2}],2:[function(require,module,exports){
module.exports = exports = require('./lib/Keyboard.js');

},{"./lib/Keyboard.js":3}],3:[function(require,module,exports){
var keyHandlers = {};

function throwErr(e){
  throw new Error(e);
}

function getCode(charOrCode){
  return (
    typeof charOrCode === 'number' ? charOrCode :
    typeof charOrCode === 'string' ? charOrCode.charCodeAt(0) :
    throwError('Keyboard.map failure', 'Keyboard.map expected a string, number, or cfg object')
  );
}

var Keyboard = {
  CANCEL: {},
  map: function(charOrCode, downFn, upFn, preventDefault) {
    keyHandlers[getCode(charOrCode)] = {down: downFn, up: upFn, preventDefault: preventDefault};
  },
  unmap: function(charOrCode) {
    delete keyHandlers[getCode(charOrCode)];
  }
};

window.addEventListener('keydown', function(e){
  e.which = e.keyCode = e.which || e.keyCode || 0;
  var handlers = keyHandlers[e.which];
  if(handlers) {
    handlers.canceled = false;
    if(handlers.down) {
      var cancelUp = function cancelUp(){
        // @TODO: decide if async cancel function should cancel this mapping or
        // whatever mapping is set at the time cancelUp is called. This is currently
        // doing the latter.
        keyHandlers[e.which] && (keyHandlers[e.which].canceled = true);
      };
      handlers.downVal = handlers.down(e, cancelUp);
      handlers.canceled = handlers.downVal === Keyboard.CANCEL || handlers.canceled;
    }
    if(handlers.preventDefault) e.preventDefault();
  }
});

window.addEventListener('keyup', function(e){
  e.which = e.keyCode = e.which || e.keyCode || 0;
  var handlers = keyHandlers[e.which];
  if(handlers) {
    if(!handlers.canceled && handlers.up) handlers.up(e, handlers.downVal);
    if(handlers.preventDefault) e.preventDefault();
  }
});

module.exports = exports = Keyboard;

},{}]},{},[1]);
