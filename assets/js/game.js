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
        console.log(this);
      },
      
      start: function() {
        console.log('Start called!');
        this.resume();
      },
      
      // This is the game loop
      update: function() {
        console.log('Update called!'); 
        //this.ship.updateAngle(this.ship.anglechange);

          this.ship.update();
          /*
           *  update everything else
           */

           setTimeout( function() { 
            console.log(this); 
              if(this.SpaceRocks.Game.isRunning) { this.SpaceRocks.Game.update();} 
            } 
            , 1000 / this.fps);
         
      },
      
      pause: function() {
        $('#menu').show();
        this.isRunning = false;
      },
      
      resume: function() {
        $('#menu').hide();
        this.isRunning = true;
        this.update();
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
        // increases speed if running
        if(this.isRunning){
          //makes the ship start to move
          if(this.ship.speed == 0)
            this.ship.speed = 1;
          //if the ship is moving under it's maximum speed, it is accelerated, otherwise nothing is done
          else if(this.ship.speed < this.ship.MAX_SPEED){
            this.ship.speed *= this.ship.ACCELERATION
          }
          console.log(this.ship.speed);
        }
      },
    
      down: function() {
        if(this.isRunning){
          //decelerates if the speed is above 1
          if(this.ship.speed > 1){
            this.ship.speed /= this.ship.ACCELERATION
          }
          //if it is moving at minimum speed, it stops the ship
          else this.ship.speed=0;
          console.log(this.ship.speed);
        }

      },
    
      left: function() {
        console.log('left');
        
        if (this.isRunning) {
          this.ship.anglechange -= this.ship.ANGLE_DELTA_INCREMENT;
          //console.log(this.ship.anglechange);
        }
      },
    
      right: function() {
        console.log('right');
        if (this.isRunning) {
          this.ship.anglechange += this.ship.ANGLE_DELTA_INCREMENT;
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

/*
var Interval = setInterval(this.gameLoop(), 1000/this.game.fps)
function gameLoop(){
  this.game.update();
} 
*/
  console.log(this);
  window.SpaceRocks.Game = Game;
  
})();
