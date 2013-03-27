(function() {

  var Game = (function() {
    
    var WINDOW_SIZE = 500;
    var INITIAL_ASTEROID_COUNT = 5;   
    var totalAsteroids = 5;  

    var game = {
      // Properties

      // frames per second
      fps: 25,

      level: 0,

      // flag used to know when to stop the game loop
      isRunning: false,
      windowSize: WINDOW_SIZE,
      asteroids: [],
      bullets: [],
      asteroidRadius: 20,
      
      init: function(canvasContainer) {
        var Ship = window.SpaceRocks.Ship;
        this.paper = new Raphael(canvasContainer, this.windowSize, this.windowSize);
        this.ship = new Ship(this.paper);
        console.log(this);
        var SoundSystem = window.SpaceRocks.SoundSystem;
        this.sounds = new SoundSystem(true);
        var Asteroids = window.SpaceRocks.Asteroids;
        for(var i = 0; i < totalAsteroids; i++){
          this.asteroids[i] = new Asteroids(this.paper);
        }
      },
      
      start: function() {
        console.log('Start called!');
        this.resume();
      },
      
      // This is the game loop
      update: function() {
          this.ship.update();
          for(var i = 0; i < this.asteroids.length; i++){
            this.asteroids[i].updatePosition();
          }
          for( var b = 0; b < this.bullets.length; b++ ){
            if(this.bullets[b].updatePosition()){
              this.bullets[b].obj.remove();
              this.bullets.remove(b);
            }  
          }
          this.bulletCollision();
          this.shipCollision();
          /*
           *  update everything else
           */

           setTimeout( function() { 
              if(this.SpaceRocks.Game.isRunning) { 
                this.SpaceRocks.Game.update();
              } 
            } 
            , 1000 / this.fps);
         
      },
      
      bulletCollision: function(){
        var bulletLength = this.bullets.length;
        var asteroidsLength = this.asteroids.length;
        for(var b = 0; b < bulletLength; b++){
          for(var a = 0; a < asteroidsLength; a++){
            console.log("bullets" + this.bullets);
            console.log("asteroids" + this.asteroids);
            try{
              if(distance(this.bullets[b].position, this.asteroids[a].position)<this.asteroidRadius)
              {
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

      shipCollision: function(){
        for (var a = 0; a <this.asteroids.length; a++){
          if (distance(this.asteroids[a].position, this.ship.position)<this.asteroidRadius){
            console.log("Ship collision detected.");
            this.sounds.shipExplode.play();
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
          if(this.sounds.engine.paused)
            this.sounds.engine.play();
          //console.log(this.ship.speed);
        }
      },
    
      upUp: function(){
        if(!this.sounds.engine.paused)
          this.sounds.engine.pause();
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
      
      space: function(){
        this.sounds.gun.play();
        var Bullet = window.SpaceRocks.Bullet;
            var b = new Bullet(this.paper, this.ship , toDegrees(Math.sin(this.level-1))); 
            this.bullets.push( b );
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