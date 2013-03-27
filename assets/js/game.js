(function() {

  var Game = (function() {
    
    var WINDOW_SIZE = 500;
    var INITIAL_ASTEROID_COUNT = 5;
    var FPS = 25;

    var game = {

      level: 0,

      // flag used to know when to stop the game loop
      isRunning: false,
      windowSize: WINDOW_SIZE,
      asteroids: [],
      bullets: [],
      asteroidRadius: 20,
      
      init: function(canvasContainer) {
        var SoundSystem = window.SpaceRocks.SoundSystem;
        
        this.paper = new Raphael(canvasContainer, this.windowSize, this.windowSize);
        this.sounds = new SoundSystem({ voiceMode: true });
      },
      
      start: function() {        
        var Ship = window.SpaceRocks.Ship;
        var Asteroid = window.SpaceRocks.Asteroid;
        
        this.ship = new Ship(this.paper);
        
        for (var i=0; i < INITIAL_ASTEROID_COUNT; i++) {
          this.asteroids[i] = new Asteroid(this.paper);
        }
        
        this.resume();
      },
      
      bulletCollision: function(){
        var bulletLength = this.bullets.length;
        var asteroidsLength = this.asteroids.length;
        for(var b = 0; b < bulletLength; b++) {
          for(var a = 0; a < asteroidsLength; a++) {
            try{
              if( distance(this.bullets[b].position, this.asteroids[a].position) < this.asteroidRadius) {
                this.sounds.asteroidExplode.play();
                this.bullets[b].obj.remove();
                this.bullets.remove(b);
                this.asteroids[a].obj.remove();
                this.asteroids.remove(a);

                bulletLength--;
                asteroidsLength--;
              }
            }
            catch (exception){
              if (exception == TypeError)
                return true;
            }
          }
        }
      },

      shipCollision: function() {
        for (var a = 0; a < this.asteroids.length; a++){
          if (distance(this.asteroids[a].position, this.ship.position) < this.asteroidRadius){
            console.log("Ship collision detected.");
            this.sounds.shipExplode.play();
            this.ship.obj.remove();
            this.stop();
          }
        }
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
        this.isRunning = false;
        this.restart();
      },

      restart: function() {
        console.log('Restart called!'); 
        
        if (this.ship && this.ship.obj) {
          this.ship.obj.remove();
        }
        
        for (var i=0; i < this.bullets.length; i++) {
          this.bullets[i].obj.remove();
        }
        this.bullets = [];
        
        for (var i=0; i < this.asteroids.length; i++) {
          this.asteroids[i].obj.remove();
        }
        this.asteroids = [];
        
        this.start();
      },
      
      // Key Listening Handlers
    
      up: function() {
        // increases speed if running
        if(this.isRunning){
          //makes the ship start to move
          if(this.ship.speed == 0) {
            this.ship.speed = 1;
          }
          //if the ship is moving under it's maximum speed, it is accelerated, otherwise nothing is done
          else if(this.ship.speed < this.ship.MAX_SPEED) {
            this.ship.speed *= this.ship.ACCELERATION
          }
          
          if (this.sounds.engine.paused) {
            this.sounds.engine.play();
          }
            
        }
      },
    
      upUp: function(){
        if(!this.sounds.engine.paused)
          this.sounds.engine.pause();
      },

      down: function() {
        if (this.isRunning) {
          // decelerates if the speed is above 1
          if (this.ship.speed > 1) {
            this.ship.speed /= this.ship.ACCELERATION;
          }
          // if it is moving at minimum speed, it stops the ship
          else this.ship.speed = 0;
          console.log(this.ship.speed);
        }

      },
    
      left: function() {        
        if (this.isRunning) {
          this.ship.anglechange -= this.ship.ANGLE_DELTA_INCREMENT;
        }
      },
    
      right: function() {
        if (this.isRunning) {
          this.ship.anglechange += this.ship.ANGLE_DELTA_INCREMENT;
        }
      },
      
      space: function(){
        this.sounds.gun.play();
        var Bullet = window.SpaceRocks.Bullet;
        var b = new Bullet(this.paper, this.ship, toDegrees(Math.sin(this.level - 1))); 
        this.bullets.push( b );
      },

      shift: function() {
        this.update();
      },
    
      enter: function() {
         console.log("misc debugging");
      }
    };
    
    // This is the game loop
    
    var update = function() {
      this.ship.update();
      for (var i=0; i < this.asteroids.length; i++) {
        this.asteroids[i].updatePosition();
      }
      for( var b=0; b < this.bullets.length; b++ ) {
        if (this.bullets[b].updatePosition()) {
          this.bullets[b].obj.remove();
          this.bullets.remove(b);
        }  
      }
      this.bulletCollision();
      this.shipCollision();
      
      if (this.isRunning) this.update();
    };
    
    game.update = _.throttle( _.bind(update, game), 1000 / FPS);

    return game;
  })();

  window.SpaceRocks.Game = Game;
  
})();