var keyHandlers = {};

var Keyboard = {
  CANCEL: {},
  map: function(cfg, downFn, upFn) {
    var code;
    var config = {shift: false, ctrl: false, alt: false};
    if(typeof cfg === 'string') {
      config.key = cfg.charCodeAt(0);
    } else if(typeof cfg === 'number') {
      config.key = cfg;
    } else if (typeof cfg === 'object' && cfg !== null) {
      config = cfg;
    } else {
      console.error('Keyboard.map expected a string, number, or cfg object'); return;
    }
    keyHandlers[config.key] = {down: downFn, up: upFn, cfg: config};
  },
  unmap: function(key /** @TODO: cfg **/) {
    delete keyHandlers[key];
  }
};

window.addEventListener('keydown', function(e){
  e.which = e.keyCode = e.which || e.keyCode || 0;
  var handlers = keyHandlers[e.which];
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
});

window.addEventListener('keyup', function(e){
  e.which = e.keyCode = e.which || e.keyCode || 0;
  var handlers = keyHandlers[e.which];
  if (!handlers.canceled && handlers.up) {
    handlers.up(e, handlers.downVal);
  }
});

module.exports = exports = Keyboard;
