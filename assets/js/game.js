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
          this.loseGame();
        }
      },

      loseGame: function() {
        console.log("you've lost");
        console.log("your score is: " + this.totalScore);
      },

      levelUp: function(){
        var Asteroid = window.SpaceRocks.Asteroid;
        console.log("leveling up...");
        for (var i=0; i<(INITIAL_ASTEROID_COUNT + this.level); i++)
          this.asteroids.push(new Asteroid(this.paper));
      },
      
      // Remove objects from the game
      
      removeBullet: function(bullet) {
        bullet.obj.remove();
        this.bullets = _.without(this.bullets, bullet);
        return bullet;
      },
      
      removeAlienBullet: function(alienBullet) {
        alienBullet.obj.remove();
        this.alienBullets = _.without(this.alienBullets, alienBullet);
        return alienBullet;
      },
      
      removeAsteroid: function(asteroid) {
        var Asteroid = window.SpaceRocks.Asteroid;
        
        this.sounds.asteroidExplode.play();
        asteroid.obj.remove();
        this.asteroids = _.without(this.asteroids, asteroid);
        if (asteroid.intSize > 0) {
          this.asteroids.push(new Asteroid(this.paper, asteroid, -COLLISION_ANGLE)); 
          this.asteroids.push(new Asteroid(this.paper, asteroid, COLLISION_ANGLE));
        }
        return asteroid;
      },
      
      removeAlienShip: function() {
        this.sounds.asteroidExplode.play();
        this.alienShip.obj.remove();
        this.alienShip = null;
      },
      
      removeShip: function() {
        this.sounds.shipExplode.play();
        this.totalScore += this.score;
        this.ship.obj.remove();
        this.lives--;
        $('.life').last().remove();
        this.stop();
      },
      
      // Detect collisions

      shipCollision: function() {
        var Asteroid = window.SpaceRocks.Asteroid;
        var Ship = window.SpaceRocks.Ship;
                
        _.each(this.ship.points, function(point) {
          if (_.any(this.asteroids, Asteroid.collidedWith(point), this)) {
            this.removeShip();
          }
        }, this);

        _.each(this.alienBullets, function(bullet) {
          var collided = bullet.position.x > this.ship.points[0].x && 
                  bullet.position.x < this.ship.points[3].x &&
                  bullet.position.y > this.ship.points[0].y &&
                  bullet.position.y < this.ship.points[3].y;
          if (collided) {
            this.removeAlienBullet(bullet);
            return this.removeShip();
          }
        }, this);

        if (this.alienShip && _.any(this.alienShip.points, Ship.collision(this.ship))) {
          this.removeAlienShip();
          this.removeShip();
        }
      },
      
      alienBulletCollision: function() {
        var Asteroid = window.SpaceRocks.Asteroid;
        
        _.each(this.alienBullets, function(bullet) {
          var asteroid = _.find(this.asteroids, Asteroid.collidedWith(bullet.position));
          if (asteroid) {
            this.removeAlienBullet(bullet);
            this.removeAsteroid(asteroid);
          }
        }, this);
      },
      
      bulletCollision: function(){
        var Asteroid = window.SpaceRocks.Asteroid;
        var AlienShip = window.SpaceRocks.AlienShip;
        
        var alienCollision = AlienShip.collision(this.alienShip);
        
        _.each(this.bullets, function(bullet) {
          var asteroid = _.find(this.asteroids, Asteroid.collidedWith(bullet.position));
          
          if (asteroid) {
            this.score += (asteroid.intSize + 1) * 50;
            this.removeBullet(bullet);
            this.removeAsteroid(asteroid);
          } else if (this.alienShip) {
            if (alienCollision(bullet.position)) {
              this.removeBullet(bullet);
              this.removeAlienShip();
            }
          }
        }, this);
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
            this.ship.speed += Math.log(this.ship.ACCELERATION);
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
            this.ship.speed -= Math.log(this.ship.ACCELERATION);
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
        
        if (!this.alienShip){
          this.alienShip = new AlienShip(this.paper, "alien");
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
      if(this.alienShip){
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
      this.shipCollision();
      this.alienBulletCollision();
      this.bulletCollision();

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