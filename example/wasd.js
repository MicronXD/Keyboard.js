var Keyboard = require('../');

'WASD'.split('').forEach(function mapKeyById(key) {
  Keyboard.map(key, function(){
    document.getElementById(key).classList.add('down');
  }, function(){
    document.getElementById(key).classList.remove('down');
  });
});
