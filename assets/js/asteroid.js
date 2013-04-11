(function(){
	var Game = window.SpaceRocks.Game;
	var wrap = wrapAround(Game.windowSize);

  //the sizes the asteroids will be scaled by. They are pointed to by this.intSize .
  var sizes = [ 1, 3 , 6];

	var Asteroid = function(paper, parent, dtheta) {

    /*if no information is sent to make a new asteroid, this method randomly creates an asteroid which spawns at a random
     *postition with a randomly generated velocity and angle. 
     *We will have to make sure that the position doesn't fall within a radius of the ship. */
    if(parent == null){
      console.log("random asteroid");
      //randomly get a position
      this.position = { x: Math.random() * Game.windowSize, y: Math.random() * Game.windowSize };
      //randomly generate an angle which is < 360
      this.angle = Math.floor(Math.random() * 360);
      //randomly generate a pointer (between 0 and sizes.length [3])
      this.intSize = Math.floor(Math.random() * sizes.length);
      //the size the asteroid is scaled to is generated here
      this.asteroidSize = sizes[this.intSize];

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

		//Asteroid Path 
    var path = [
      "M50,50L80,50L100,60L110,80L115,90L110,110L108,115L105,120L95,125L85,130L50,130L30,120L25,100L25,75L35,65z"
    ].join('');
    this.obj = paper.path(path).attr({"stroke-width": 2, fill: "90-#333333-#CCCCCC" });
    
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