(function() {
  
  var Game = (function() {
    
    var WINDOW_SIZE = 500;
    var INITIAL_ASTEROID_COUNT = 10;    

    var game = {
      // Properties
          
      // frames per second
      fps: 25,
    
      // flag used to know when to stop the game loop
      isRunning: false,
      windowSize: WINDOW_SIZE,
      asteroids: [],
      bullets: [],
      
      init: function(canvasContainer) {
        var Ship = window.SpaceRocks.Ship;
      
        this.paper = new Raphael(canvasContainer, this.windowSize, this.windowSize);
        this.ship = new Ship(this.paper);
      },
      
      start: function() {
        console.log('Start called!');
        this.resume();
      },
      
      // This is the game loop
      update: function() {
        console.log('Update called!'); 
      },
      
      pause: function() {
        $('#menu').show();
        this.isRunning = false;
      },
      
      resume: function() {
        $('#menu').hide();
        this.isRunning = true;
      },
      
      stop: function() {
        console.log('Stop called!');
        this.isRunning = false;
      },

      restart: function() {
        console.log('Restart called!'); 
        this.start();
      },
      
    
      // Key Listening Handlers
    
      up: function() {
        // Jit, couldn't figure out what you were doing in here!
      },
    
      down: function() {
        // Jit, not sure what was happening in here!
      },
    
      left: function() {
        console.log('left');
        this.ship.angle -= this.ship.ANGLE_DELTA;
        if (this.isRunning) {
          
        }
      },
    
      right: function() {
        if (this.isRunning) {
          this.ship.angle += this.ship.ANGLE_DELTA;
        }
      },
    
      shift: function() {
        this.update();
      },
    
      enter: function() {
         console.log("misc debugging");
      }
    };

    return game;
  })();

  window.SpaceRocks.Game = Game;
  
})();



