(function() {
  
  var Game = window.SpaceRocks.Game;
  
  // Higher order function. Returns a new function
  // that wraps the position if necessary
  
  var wrap = wrapAround(Game.windowSize);
  
  var Ship = function(paper) {
    
    this.obj = paper.path("M 15.834,29.084 15.834,16.166 2.917,16.166 29.083,2.917z");
    this.obj.attr({
      'stroke': '#3b4449',
      'stroke-width': 1,
      'stroke-linejoin': 'sharp',
      'transform': 't' + (Game.windowSize / 2) + ',' + (Game.windowSize / 2) + 'r' + (-45)
    });
    
    this.speed = 0;
    this.position = { x: 0, y: 0 };
    
    // the angle the ship points
    this.angle = -45;
      
    // the angle the ship moves
    this.direction = -45;
  }
  
  Ship.prototype = {
    ANGLE_DELTA: 5,
    ACCELERATION: 1,
    MAX_SPEED: 20,
    
    updateAngle: function(angle) {
      this.obj.rotate(angle);
      this.angle = (this.angle + angle) % 360;
    },
    
    updatePosition: function(position) {
      
      var bbox = this.obj.getBBox();
      this.position.x += (bbox.x + bbox.width / 2) % Game.windowSize;
      this.position.y += (bbox.y + bbox.height / 2) % Game.windowSize;
      
      // Wrap around if it goes off left or right
      this.position.x = wrap(this.position.x);
      this.position.y = wrap(this.position.y);
      
      console.log('Ship position: (' + this.position.x + ', ' + this.position.y + ')');
    },
    
    update: function() {
      // update angle and position
    }

  }
  
  window.SpaceRocks.Ship = Ship;

})();