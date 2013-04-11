(function(){
	var Game = window.SpaceRocks.Game;
	var wrap = wrapAround(Game.windowSize);

  //the sizes the asteroids will be scaled by. They are pointed to by this.intSize .
  var sizes = [ 1, 3 , 6];

	var Asteroid = function(paper, parent, dtheta) {
		var distance = window.distance(Asteroid, Game.ship);
		
	

    /*if no information is sent to make a new asteroid, this method randomly creates an asteroid which spawns at a random
     *postition with a randomly generated velocity and angle. 
     *We will have to make sure that the position doesn't fall within a radius of the ship. */
    if(parent == null){
		//if distance between ship and asteroid is less than 300, asteroid will be generated at least 300 pixels away from 			the position of the ship 
		if (distance < 300){
      console.log("random asteroid");
	  //randonly generates a position 400 pixels away from the ship's position
      this.position = { x: Math.random() * (Game.windowSize-(Game.ship.position.X+400)), y: Math.random() * (Game.windowSize-(Game.ship.position.Y+400)) };
      //randomly generate an angle which is < 360
      this.angle = Math.floor(Math.random() * 360);
      //randomly generate a pointer (between 0 and sizes.length [3])
      this.intSize = Math.floor(Math.random() * sizes.length);
      //the size the asteroid is scaled to is generated here
      this.asteroidSize = sizes[this.intSize];
  		}
		else{ 
	  console.log("random asteroid");
	  //otherwise, asteroids are generated at random position
      this.position = { x: Math.random() * Game.windowSize, y: Math.random() * Game.windowSize};
      //randomly generate an angle which is < 360
      this.angle = Math.floor(Math.random() * 360);
      //randomly generate a pointer (between 0 and sizes.length [3])
      this.intSize = Math.floor(Math.random() * sizes.length);
      //the size the asteroid is scaled to is generated here
      this.asteroidSize = sizes[this.intSize]; 
  		}	
	
      //the asteroid is actually scaled in the this.obj.transform statement further below
    }
    /*This method is excecuted if a 'parent' asteroid (with .intSize > 1) is destroyed. It takes the same (x,y) position 
     *as its parent, but changes the angle by a passed value dthetha. It also changes how big the asteroid is*/
    else{
      console.log("on explosion");
      //Starting the child asteroids at parent.position +/- 1 fixes the issue where they are treated as one.
      this.position = { x: parent.position.x + (dtheta/Math.abs(dtheta)), y: parent.position.y + (dtheta/Math.abs(dtheta))};
      //changes the parent asteroids angle by a passed value
      this.angle = parent.angle + dtheta;
      //changes the pointer for the asteroid to the size one below it
      this.intSize = parent.intSize-1;
      //updates the size the asteroid is scaled to
      this.asteroidSize = sizes[this.intSize];
    }

    //this is the asteroidRadius used in the collision detection
    //Ben, you should modify this to the game more playable
    this.asteroidRadius = 15 * this.asteroidSize;

    var path = [
      "M20.402,17.626c0.84-0.772,2.468-0.381,5.979-1.853c1.716-0.72,1.572-1.265,1.566-1.928c-",
      "0.001-0.014,0-0.027,0-0.041h-0.005c-0.012-0.667-0.291-1.332-0.846-1.845L17.049,2.684c-",
      "0.566-0.522-1.304-0.782-2.042-0.782V1.898c-0.738,0-1.475,0.261-2.04,0.783l-10.05,9.276c-",
      "0.554,0.512-0.832,1.176-0.843,1.844H2.07c0,0,0.003,0.011,0.004,0.011c0,0.012-0.004,0.024-",
      "0.004,0.034h0.017c0.193,0.676,5.164,1.536,5.718,2.049c0.838,0.774-3.211,1.339-2.374,2.114c0.838,",
      "0.773,5.062,1.496,5.898,2.271c0.838,0.771-1.711,1.596-0.874,2.366c0.837,0.773,3.651-0.191,3.142,",
      "1.822c1.13,1.045,3.49,0.547,5.071-0.498c0.837-0.771-1.607-0.703-0.77-1.477c0.836-0.774,2.949-0.777,",
      "4.73-2.627C21.913,18.838,19.566,18.398,20.402,17.626zM10.973,16.868l-0.42-0.504c1.497,0.358,3.162,",
      "0.827,4.498,0.837l0.058,0.554C13.964,17.646,11.544,17.137,10.973,16.868zM18.161,8.58l-1.396-",
      "0.74L14.53,9.594l-1.067-3.192l-1.177,2.545L8.998,9.25l0.036-1.352c0-0.324,1.895-2.596,3.05-",
      "3.136l2.112-1.401c0.312-0.186,0.53-0.261,0.727-0.257c0.327,0.011,0.593,0.239,1.112,0.55l4.748,",
      "3.25c0.357,0.215,0.619,0.522,0.626,0.898l-2.813-1.254L18.161,8.58z"
    ].join('');
    this.obj = paper.path(path).attr({ fill: '#000', stroke: 'none' });
    
    this.obj.transform( ['t', this.position.x, ',', this.position.y, 'r', this.angle, 's', 
            this.asteroidSize, ',', this.asteroidSize].join('') );
   
    var bbox = this.obj.getBBox();
    this.asteroidCenter = { x: bbox.x + (bbox.width / 2), y: bbox.y + (bbox.height / 2) };
  }
  
  Asteroid.prototype = {
    SPEED: 2,
    updatePosition: function() {
      var angle = toRadians(this.angle);
      var dx = Math.sin(angle) * this.SPEED;
      var dy = Math.cos(angle + Math.PI) * this.SPEED;
      
      //updates the position values based of the declared speed of asteroids
      this.position.x = wrap( this.position.x + dx );
      this.position.y = wrap( this.position.y + dy );

      this.obj.transform( ['t', this.position.x, ',', this.position.y, 'r', this.angle, 's', 
              this.asteroidSize, ',', this.asteroidSize].join('') );
      
      var bbox = this.obj.getBBox();
      this.asteroidCenter = { x: bbox.x + (bbox.width / 2), y: bbox.y + (bbox.height / 2) };
    }
  }
  
  Asteroid.collidedWith = function(position) {
    var test = function(asteroid) {
      return distance(position, asteroid.asteroidCenter) < asteroid.asteroidRadius;
    }
    return test;
  }
  
  window.SpaceRocks.Asteroid = Asteroid;
			
})();