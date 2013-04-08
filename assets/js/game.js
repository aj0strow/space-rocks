(function() {

  var Game = (function() {
    
    var LIFE = '<span class="life"></span>';
    var WINDOW_SIZE = 500;
    var INITIAL_ASTEROID_COUNT = 1;
    var COLLISION_ANGLE = 45;
    var INITIAL_LIVES = 3;
    var FPS = 25;

    var game = {
      lives: INITIAL_LIVES,
      level: 0,

      score: -1,
      totalScore: 0,

      // flag used to know when to stop the game loop
      isRunning: false,
      windowSize: WINDOW_SIZE,
      asteroids: [],
      bullets: [],
      alienBullets: [],
      alienShipExists: false,
      
      init: function(canvasContainer) {
        var SoundSystem = window.SpaceRocks.SoundSystem;
        
        this.paper = new Raphael(canvasContainer, this.windowSize, this.windowSize);
        this.sounds = new SoundSystem({ voiceMode: true });
      },
      
      start: function() {
        if (this.lives > 1) {
          this.score = 0;
          var Ship = window.SpaceRocks.Ship;
          var Asteroid = window.SpaceRocks.Asteroid;
          
          this.ship = new Ship(this.paper);
          
          for (var i=0; i < INITIAL_ASTEROID_COUNT; i++) {
            this.asteroids.push(new Asteroid(this.paper));
          }
          
          this.resume();
        }
        else {
          this.gameLost();
        }
      },

      gameLost: function() {
          console.log("you've lost");
          console.log("your score is: " + this.totalScore);
      },

      levelUp: function(){
        var Asteroid = window.SpaceRocks.Asteroid;
        console.log("leveling up...");
        for (var i=0; i<(INITIAL_ASTEROID_COUNT + this.level); i++)
          this.asteroids.push(new Asteroid(this.paper));
      },
      
      bulletCollision: function(){
        for(var b = 0; b < this.bullets.length; b++) {
          for(var a = 0; a < this.asteroids.length; a++) {
            try{
              if( distance(this.bullets[b].position, this.asteroids[a].asteroidCenter) < this.asteroids[a].asteroidRadius) {
                this.sounds.asteroidExplode.play();
                this.score += (this.asteroids[a].asteroidSize + 1) * 50;
                this.bullets[b].obj.remove();
                this.bullets.remove(b);
                this.asteroids[a].obj.remove();
                this.asteroids.remove(a);
                
                console.log(this.score);
              }
            }
            catch (exception){
              if (exception == TypeError)
                return true;
            }
          }
          if (this.alienShip) {
            for(var p = 0; p < this.alienShip.points.length; p++){
              if(this.bullets[b].position.x > this.alienShip.points[0].x && this.bullets[b].position.x < this.alienShip.points[3].x){
                if(this.bullets[b].position.y > this.alienShip.points[0].y && this.bullets[b].position.y < this.alienShip.points[3].y){
                  this.sounds.asteroidExplode.play();
                  this.bullets[b].obj.remove();
                  this.alienShip.obj.remove();
                  this.alienShipExists = false;
                }
              }
            }
          }
        }
        for(var b = 0; b < this.alienBullets.length; b++) {
          for(var a = 0; a < this.asteroids.length; a++) {
            try{
              if( distance(this.alienBullets[b].position, this.asteroids[a].asteroidCenter) < this.asteroids[a].asteroidRadius) {
                this.sounds.asteroidExplode.play();
                this.score += (this.asteroids[a].asteroidSize + 1) * 50;
                this.alienBullets[b].obj.remove();
                this.alienBullets.remove(b);
                this.asteroids[a].obj.remove();
                this.asteroids.remove(a);
                
                console.log(this.score);
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
          for (var p = 0; p < this.ship.points.length; p++){
            if(distance(this.asteroids[a].asteroidCenter, this.ship.points[p]) < this.asteroids[a].asteroidRadius){
              this.sounds.shipExplode.play();
              this.totalScore += this.score;
              this.ship.obj.remove();
              this.stop();
              this.lives--;
            }
          }
        }
        for (var b = 0; b < this.alienBullets.length; b++){
          if(this.alienBullets[b].position.x > this.ship.points[0].x && this.alienBullets[b].position.x < this.ship.points[3].x){
            if(this.alienBullets[b].position.y > this.ship.points[0].y && this.alienBullets[b].position.y < this.ship.points[3].y){
              this.sounds.shipExplode.play();
              this.totalScore += this.score;
              this.ship.obj.remove();
              this.alienBullets[b].obj.remove();
              this.alienBullets.remove(b);
              this.stop();
              this.lives--;
            }
          }
        }
        if(this.alienShipExists){
          for(p = 0; p < this.alienShip.points.length; p++){
            if(this.alienShip.points[p].x > this.ship.points[0].x && this.alienShip.points[p].x < this.ship.points[3].x){
              if(this.alienShip.points[p].y > this.ship.points[0].y && this.alienShip.points[p].y < this.ship.points[3].y){
                this.sounds.shipExplode.play();
                this.totalScore += this.score;
                this.ship.obj.remove();
                this.alienShip.obj.remove();
                this.alienShipExists = false;
                // this.alienShip.remove();
                console.log("Lives: " + this.lives);
                this.lives--;
                $('.life').last().remove();
                this.stop();
              }
            }
          }
        }
      },

      pause: function() {
        $('#scores').hide();
        $('#overlay').show();
        $('#menu').show();
        this.isRunning = false;
      },
      
      resume: function() {
        $('#overlay').hide();
        this.isRunning = true;
        this.update();
      },
      
      stop: function() {
        this.isRunning = false;
        this.restart();
      },

      restart: function() {
        console.log('Restart called!'); 
        
        $('#lives').html(LIFE + LIFE + LIFE);
        
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
        if (this.isRunning){
          //makes the ship start to move
          if (this.ship.speed == 0) {
            this.ship.speed = 1;
          }
          //if the ship is moving under it's maximum speed, it is accelerated, otherwise nothing is done
          else if (this.ship.speed < this.ship.MAX_SPEED) {
            this.ship.speed *= this.ship.ACCELERATION
          }
          
          if (this.sounds.engine.paused) {
            this.sounds.engine.play();
          }
            
        }
      },
    
      upUp: function(){
        if (!this.sounds.engine.paused)
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
        var Bullet = window.SpaceRocks.Bullet;
        
        this.sounds.gun.play();
        this.bullets.push( new Bullet(this.paper, this.ship, 0) );
      },

      shift: function() {
        this.update();
      },
    
      enter: function() {
        var AlienShip = window.SpaceRocks.AlienShip;
        
        if (!this.alienShipExists){
          this.alienShip = new AlienShip(this.paper, "alien");
          this.alienShipExists = true;
        }
      }
    };
    
    // This is the game loop
    
    var update = function() {
      this.ship.update();
      for (var i=0; i < this.asteroids.length; i++) {
        this.asteroids[i].updatePosition();
      }
      for (var b=0; b < this.bullets.length; b++) {
        if (this.bullets[b].updatePosition()) {
          this.bullets[b].obj.remove();
          this.bullets.remove(b);  
        }  
      }
      if(this.alienShipExists){
        this.alienShip.updatePosition();
        //makes bullets occasionally
        if (Math.random() > 0.9){
          this.sounds.gun.play();
          var Bullet = window.SpaceRocks.Bullet;
          var bul = new Bullet(this.paper, this.alienShip, 0, this.ship); 
          this.alienBullets.push( bul );
        }
        //updates all alien bullets
        for (var c=0; c < this.alienBullets.length; c++) {
          if (this.alienBullets[c].updatePosition()) {
            this.alienBullets[c].obj.remove();
            this.alienBullets.remove(c);  
          }  
        }
      }
      this.bulletCollision();
      this.shipCollision();

      if (this.asteroids.length == 0){
        this.levelUp();
      }

      $('#score').text(this.score);
      
      if (this.isRunning) this.update();
    };
    
    game.update = _.throttle(_.bind(update, game), 1000 / FPS);

    return game;
  })();

  window.SpaceRocks.Game = Game;
  
})();