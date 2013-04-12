(function() {
  var wrap = wrapAround(window.SpaceRocks.Game.windowSize);

  var Bullet = function(paper, position, angle) {  
    this.position = position;
    this.angle = angle;
    this.distanceTraveled = 0;
  	this.obj = paper.path('M 0,5 L0,0');  	
  }
  
  Bullet.prototype = {
    
    SPEED: 12,
    MAX_DISTANCE: 480,
    
    updatePosition: function() {
      var angle = toRadians(this.angle);
      var dx = Math.sin(angle) * this.SPEED;
      var dy = Math.cos(angle + Math.PI) * this.SPEED;
        
      this.position.x = wrap( this.position.x + dx );
      this.position.y = wrap( this.position.y + dy );
        
      this.obj.transform(['t', this.position.x, ',', this.position.y, 'r', this.angle].join(''));
      this.distanceTraveled += this.SPEED;
    },
    
    isExpired: function() {
      return this.distanceTraveled > this.MAX_DISTANCE;
    }
  }
	
  window.SpaceRocks.Bullet = Bullet;
})();