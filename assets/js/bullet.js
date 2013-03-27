(function() {
  
  var Game = window.SpaceRocks.Game;
  var Ship = window.SpaceRocks.Ship;
  var wrap = wrapAround(Game.windowSize);

  // bonus angle is for when we have -- BEN: when we have what??
  var Bullet = function(paper, ship, bonusAngle) {  
    
    if (ship.type == "smartAlien") {
      var dx = ship.position.x - Ship.position.x,
          dy = ship.position.y - Ship.position.y;
      this.angle = Math.atan(dx / dy);
    } else if(ship.type == "alien") {
      this.angle = Math.floor(Math.random() * 360);
    } else {
      this.angle = ship.angle + 45;
    }
      
    // gets the bounding box
    var bbox = ship.obj.getBBox();

    // updating position of bullet
    this.position = { 
      x: bbox.x + bbox.width / 2, 
      y: bbox.y + bbox.height / 2 
    };

    // shipPosition is a constant correction factor:
    // when the bullet is made, poisition is affected by a margin of error
    this.shipPosition = { 
      x: bbox.x + bbox.width / 2, 
      y: bbox.y + bbox.height / 2
    };
    
  	this.obj = paper.path( ['M', this.position.x, ' ', this.position.y, 'l', 0, ' ', 10].join('') );
  	this.obj.rotate( this.angle );
    
    this.distanceTraveled = 0;
  }
  
  Bullet.prototype = {
    
    SPEED: 12,
    MAX_DISTANCE: 480,
    
    updatePosition: function() {
      if (this.distanceTraveled < this.MAX_DISTANCE) {
        var angle = toRadians(this.angle);
        var dx = Math.sin(angle) * this.SPEED;
        var dy = Math.cos(angle + Math.PI) * this.SPEED;
        
        this.position.x = wrap( this.position.x + dx );
        this.position.y = wrap( this.position.y + dy );
        
        this.obj.transform( ['t', this.position.x - this.shipPosition.x, ',', 
                this.position.y - this.shipPosition.y, 'r', this.angle].join('') );
        this.distanceTraveled += this.SPEED;
        return false;
      } else {
        return true;
      }
    }
  }
	
  window.SpaceRocks.Bullet = Bullet;

})();