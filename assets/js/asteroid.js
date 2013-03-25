(function(){
	var Game = window.SpaceRocks.Game;
	var wrap = wrapAround(Game.windowSize);
	var screenWidth = 600;
	var screenHeight = 800;
	var Asteroids = function(count){
		console.log("making asteroids...");
		//I've created a constant totalAsteroids in the game.js
		if(count == this.totalAsteroids){
			for(var i = 0; i < count; i++ ){
				var rock = new Asteroids();
				this.rock.postion = {x: Math.random() * this.screenWidth, y: Math.random() * this.screenHeight};
				
      }
      rock.vel.x = Math.random() * 4 - 2;
      rock.vel.y = Math.random() * 4 - 2;
      if (Math.random() > 0.5) {
        rock.points.reverse();
      }
      rock.vel.rot = Math.random() * 2 - 1;
      
    }
  }
    this.MOVE_DISTANCE = 12;
    this.MAX_DISTANCE  = 480;
	this.distanceTraveled = 0;
  this.updatePostion = function(){
  	console.log(this.postion);
  	if(this.distanceTraveled < this.MAX_DISTANCE){
  		this.position.x += (Math.sin((Math.PI / 180)) * this.MOVE_DISTANCE);
          this.position.y += (Math.cos((Math.PI / 180) + Math.PI) * this.MOVE_DISTANCE);
          this.position.x = wrap(this.position.x);
          this.position.y = wrap(this.position.y);
          this.distanceTraveled += this.MOVE_DISTANCE;

  	}
  	else return true;}

  }
  window.SpaceRocks.Asteroids = Asteroids;
			
})();