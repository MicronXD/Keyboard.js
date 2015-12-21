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
  keyStates: {},
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
  var state = Keyboard.keyStates[e.which];
  var handlers = keyHandlers[e.which];
  if(!state){
    Keyboard.keyStates[e.which] = 1;
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
  }
});

window.addEventListener('keyup', function(e){
  e.which = e.keyCode = e.which || e.keyCode || 0;
  Keyboard.keyStates[e.which] = 0;
  var handlers = keyHandlers[e.which];
  if(handlers) {
    if(!handlers.canceled && handlers.up) handlers.up(e, handlers.downVal);
    if(handlers.preventDefault) e.preventDefault();
  }
});

module.exports = exports = Keyboard;
