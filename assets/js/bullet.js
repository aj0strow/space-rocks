(function() {
  var Game = window.SpaceRocks.Game;
  var wrap = wrapAround(Game.windowSize);

  	//this.BULLET_LENGTH = 10;
    //bonus angle is for when we have 
  var Bullet = function(paper , ship, bonusAngle){  
    console.log("making bullet...");
    this.angle = ship.angle + 45;

    //gets boundingbox
    var bbox = ship.obj.getBBox();

    //updating position of bullet
    this.position = {x: (bbox.x + bbox.width/2) , y: ((bbox.y + bbox.height/2))};

    //constant correction factor. When the bukllet is made, poisition os affected by a margin of error
    this.shipPosition = {x: (bbox.x + bbox.width/2) , y: ((bbox.y + bbox.height/2))  };
  	this.obj = paper.path('M' + (this.position.x) + ' ' + (this.position .y) + 'l' + 0 + ' ' + 10);
      
  	this.obj.rotate( this.angle );

    //contants, in pixels
  	this.MOVE_DISTANCE = 12;
    this.MAX_DISTANCE  = 480;



    this.distanceTraveled = 0;

  	this.updatePosition = function() {
      console.log(this.position); 
      if(this.distanceTraveled < this.MAX_DISTANCE){
        
        console.log("distance change: x: " + (Math.sin((this.angle * Math.PI / 180)) * this.MOVE_DISTANCE) + " y: " + (Math.cos((this.angle * Math.PI / 180) + Math.PI) * this.MOVE_DISTANCE));
          this.position.x += (Math.sin((this.angle * Math.PI / 180)) * this.MOVE_DISTANCE);
          this.position.y += (Math.cos((this.angle * Math.PI / 180) + Math.PI) * this.MOVE_DISTANCE);
          this.position.x = wrap(this.position.x);
          this.position.y = wrap(this.position.y);
        this.obj.transform("t" + (this.position.x - this.shipPosition.x) + "," + (this.position.y - this.shipPosition.y) + 'r' + this.angle);
          this.distanceTraveled += this.MOVE_DISTANCE;
          
        }
      else return true;
      };

  	}
	
    window.SpaceRocks.Bullet = Bullet;

})();