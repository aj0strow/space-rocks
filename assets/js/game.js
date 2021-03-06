(function() {
  
  /*
   * There are 2 main game parts:
   * - Game consisting of 3 lives
   * - Life consisting of * levels
  */
  
  var Game = (function() {
    
    var LIFE = '<span class="life"></span>';
    var SCORE_TEMPLATE = "<tr><td><%= name %></td><td><%= score %></td></tr>";
    var WINDOW_SIZE = 500;
    var INITIAL_ASTEROID_COUNT = 1;
    var COLLISION_ANGLE = 45;
    var INITIAL_LIVES = 3;
    var FPS = 30;

    var game = {
      score: -1,
      totalScore: [0 , 0],

      // flag used to know when to stop the game loop
      isRunning: false,
      windowSize: WINDOW_SIZE,
      asteroids: [],
      bullets: [],
      alienBullets: [],
      keysDown: [],
      shipTurn: true,
      
      init: function(canvasContainer) {
        var SoundSystem = window.SpaceRocks.SoundSystem;
        
        this.paper = new Raphael(canvasContainer, this.windowSize, this.windowSize);
        this.sounds = new SoundSystem({ voiceMode: false });
      },
      
      endGame: function() {
        this.isRunning = false;
        this.paper.clear();
        
        this.asteroids = [];
        this.bullets = [];
        this.alienBullets = [];
        this.ship = null;
        this.alienShip = null;
      },
      
      loseLife: function() {
        this.removeAlienShip();
        this.removeShip();

        if(this.twoPlayer){
          this.totalScore[this.lives % 2] += this.score;
        }
        else this.totalScore[0] += this.score;

        console.log("totalscore: " + this.totalScore);
        this.level = 0;
        this.lives--;
        $('.life').last().remove();
        this.isRunning = false;
        this.start();
      },
      
      start: function() {
        var Ship = window.SpaceRocks.Ship;
        var Asteroid = window.SpaceRocks.Asteroid;
        
        if (this.lives > 0) {
          this.score = 0;
          this.ship = new Ship(this.paper);
          
          for (var i=0; i < INITIAL_ASTEROID_COUNT; i++) {
            this.asteroids.push(new Asteroid(this.paper));
          }
          this.resume();
        } else {
          this.loseGame();
        }
      },

      loseGame: function() {
        this.endGame();
        if(! this.twoPlayer){
          var name = prompt("Please enter a 3 digit name:", "...");
          var data = {
            name: (name + '...').substr(0, 3).toUpperCase(),
            score: this.totalScore[0]
          };
          $.post('/scores', data, function(response) {
            $('tbody').html(_.map(response, _.template(SCORE_TEMPLATE)).join(''));
          });
          this.totalScore = [0, 0];
          this.pause();
        }
        else{
          //logs player1's score
          var name = prompt("Player 1, please enter a 3 digit name:", "...");
          var data = {
            name: (name + '...').substr(0, 3).toUpperCase(),
            score: this.totalScore[0]
          };
          $.post('/scores', data, function(response) {
            $('tbody').html(_.map(response, _.template(SCORE_TEMPLATE)).join(''));
          });
          this.totalScore[0] = 0;

          //logs player2's score
          var name = prompt("Player 2, please enter a 3 digit name:", "...");
          var data = {
            name: (name + '...').substr(0, 3).toUpperCase(),
            score: this.totalScore[1]
          };
          $.post('/scores', data, function(response) {
            $('tbody').html(_.map(response, _.template(SCORE_TEMPLATE)).join(''));
          });

          this.totalScore[1] = 0;
          this.pause();
        }
      },

      levelUp: function(){
        var Asteroid = window.SpaceRocks.Asteroid;
        var AlienShip = window.SpaceRocks.AlienShip;
        
        this.level++;
        if (!this.alienShip && this.level % 2 == 1){ 
          this.alienShip = new AlienShip(this.paper, "alien");
        }
        this.asteroids = _(INITIAL_ASTEROID_COUNT + this.level).range().map(function() {
          return new Asteroid(this.paper);
        }, this);
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
        if (this.alienShip) {
          this.sounds.asteroidExplode.play();
          this.alienShip.obj.remove();
          this.score += 400;
          this.alienShip = null;
          _.each(this.alienBullets, function(bullet) {
            bullet.obj.remove();
          });
          this.alienBullets = [];
        }
      },
      
      removeShip: function() {
        this.sounds.shipExplode.play();
        this.ship.obj.remove();
        this.ship = null;
        _.each(this.bullets, function(bullet) { 
          bullet.obj.remove(); 
        });
        this.bullets = [];
      },

      // Detect collisions

      shipCollision: function() {
        var Asteroid = window.SpaceRocks.Asteroid;
        var Ship = window.SpaceRocks.Ship;
        
        var killerAsteroid = _.find(this.asteroids, function(asteroid) {
          return this.ship.isCollided(asteroid.position, asteroid.asteroidRadius);
        }, this);
        
        var killerBullet = _.find(this.alienBullets, function(bullet) {
          return this.ship.isCollided(bullet.position, 1);
        }, this);
        
        var killerAlien = this.alienShip && this.ship.isCollided(this.alienShip.position, 20);
        
        if (killerAsteroid) this.removeAsteroid(killerAsteroid);
        
        return killerAsteroid || killerBullet || killerAlien;
      },
      
      alienCollision: function() {
        if (this.alienShip) {
          var killerBullet = _.find(this.bullets, function(bullet) {
            return this.alienShip.isCollided(bullet.position, 1);
          }, this);
        
          if (killerBullet) {
            this.removeBullet(killerBullet);
            this.removeAlienShip();
          }
        }
      },
      
      asteroidCollision: function() {        
        _.each(this.asteroids, function(asteroid) {
          var collision = asteroid.collision();
          var killerBullet = _.find(this.bullets, collision);
          var killerAlienBullet = _.find(this.alienBullets, collision);
          
          if (killerBullet) { 
            this.removeBullet(killerBullet); 
            this.removeAsteroid(asteroid);
            this.score += 100;
          } else if (killerAlienBullet) {
            this.removeAlienBullet(killerAlienBullet);
            this.removeAsteroid(asteroid);
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

      restart: function(twoPlayer) {
        this.twoPlayer = twoPlayer;

        if(this.twoPlayer){
          this.endGame();
          this.totalScore = [0 , 0];
          this.score = 0;
          this.lives = 2 * INITIAL_LIVES;
          this.level = 0;
          $('#lives').html(LIFE + LIFE + LIFE + LIFE + LIFE + LIFE);
          this.start();
        }
        else{
          this.endGame();
          this.totalScore = [0 , 0];
          this.score = 0;
          this.lives = INITIAL_LIVES;
          this.level = 0;
          $('#lives').html(LIFE + LIFE + LIFE);
          this.start();
        }
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
          
          // if (this.sounds.engine.paused) {
          //   this.sounds.engine.play();
          // }
            
        }
      },
    
      // upUp: function(){
      //   if (!this.sounds.engine.paused)
      //     this.sounds.engine.pause();
      // },

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
        if(this.bullets.length < 10) {
          this.sounds.gun.play();
          var offset = 
          this.bullets.push( new Bullet(this.paper, this.ship.nose(), this.ship.angle) );
        }
      },

      shift: function() {
        this.update();
      },
    
      enter: function() {
        if (!this.alienShip){ 
          var AlienShip = window.SpaceRocks.AlienShip;
          this.alienShip = new AlienShip(this.paper, "alien");
        }
      },
      
      refreshScores: function() {
        
      }
      
      
    };
    
    // This is the game loop

    var update = function() {
      var Bullet = window.SpaceRocks.Bullet;
      

      _.each(this.keysDown, function(method) {
        Game[method]();
      }, this);
      // for(var i = 0; i < this.keysDown.length; i++){
      //   // console.log("stuff");
      //   Game[this.keysDown[i]]();
      // }
      if (this.asteroids.length == 0) {
        this.levelUp();
      } else {

        this.ship.update();

        _.each([ this.asteroids, this.bullets, this.alienBullets ], function(objs) {
          _.invoke(objs, 'updatePosition');
        });        
       
        if (this.bullets.length && this.bullets[0].isExpired()) {
          this.removeBullet(this.bullets[0]);
        }
        
        if (this.alienBullets.length && this.alienBullets[0].isExpired()) {
          this.removeAlienBullet(this.alienBullets[0]);
        }
        

        if (this.alienShip) {
          this.alienShip.updatePosition();
          if (Math.random() > 0.92) {
            this.sounds.gun.play();
            var angle = Math.floor(Math.random() * 360);
            var position = translatePosition(this.alienShip.position, angle, 15);
            this.alienBullets.push( new Bullet(this.paper, position, angle) );
          }
        }

        if (this.shipCollision()) {
          this.loseLife();
        } else {
          this.alienCollision();
          this.asteroidCollision();
        }       

        $('#score').text(this.score);
      }
      
      if (this.isRunning) this.update();
    };
    
    game.space = _.throttle(game.space, 5000 / FPS);
    game.update = _.throttle(_.bind(update, game), 1000 / FPS);

    return game;
  })();

  window.SpaceRocks.Game = Game;
  
})();