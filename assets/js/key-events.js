(function() {
  
  var Game = window.SpaceRocks.Game;

  // jQuery Key Codes
  
  var METHODS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  
    80: 'pause',
    16: 'shift',
    13: 'enter'
  }
  
  /*
   * Every time a key is pressed, get the corresponding method from
   * the key-value mapping above. Then if Game is running, call the 
   * corresponding method of the same name if the method exists. 
   *
   * false is returned to prevent the default behavior of key events.
  */
  
  $(document).keydown(function(evnt) {
    var method = METHODS[evnt.keyCode];
    if (Game.isRunning && Game[method]) {
      Game[method]();
    }
    return false;
  });

  $(document).keyup(function(evnt) {
    if(Game.isRunning && evnt.keyCode == 38){
      Game.upUp();
    }
    return false;
  })
  
})();
