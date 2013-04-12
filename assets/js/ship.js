(function() {
  
  var Game = window.SpaceRocks.Game;
  
  // Higher order function. Returns a new function
  // that wraps the position if necessary
  
  var wrap = wrapAround(Game.windowSize);
  
  var LENGTH = 13;
  
  var Ship = function(paper) {    
    this.obj = paper.path( [ 'M ', 
      LENGTH, ',', LENGTH, ' ', 
      LENGTH, ',', LENGTH * 2, ' ',
      LENGTH * 2, ',', 0, ' ',
      0, ',', LENGTH, ' Z' 
    ].join('') );
      
    this.obj.attr({
      'stroke': '#3b4449',
      'stroke-width': 1,
      'stroke-linejoin': 'sharp'
    });
            
    this.speed = 0;
    this.position = { x: Game.windowSize / 2, y: Game.windowSize / 2 };
    
    // the angle the ship points
    this.angle = 0;
    this.anglechange = 0;
    // the angle the ship moves
    // this.direction = -45;

    this.ANGLE_DELTA_INCREMENT = 5;
    this.ACCELERATION = 2;
    this.MAX_SPEED = 20;
    this.MOVE_DISTANCE = .5;
    
    this.updateAngle = function() {
      this.obj.rotate(this.anglechange);
      this.angle = (this.angle + this.anglechange) % 360;
      this.anglechange = 0;
    };
    
    this.updatePosition = function() {
      var angle = toRadians(this.angle);
      
      var dx = Math.sin(angle) * this.speed * this.MOVE_DISTANCE,
          dy = Math.cos(angle) * this.speed * this.MOVE_DISTANCE;
          
      this.position.x = wrap(this.position.x + dx);
      this.position.y = wrap(this.position.y - dy);
      this.obj.transform([ 't', this.position.x - LENGTH, ',', this.position.y - LENGTH, ' r', 
              this.angle - 45 ].join(''));
    };
    
    this.update = function() {
      this.updateAngle();
      this.updatePosition();
    };
    
    this.radius = function(angle) {
      if (angle < 30) {
        return LENGTH * (1 + ((30 - angle) / 30) * (Math.sqrt(2) - 1));
      } else if (angle < 120) {
        return Math.abs(angle - 75) * (LENGTH / 70) + LENGTH / 2;
      } else {
        return Math.abs(180 - angle) * (LENGTH / 60);
      }
    };
    
    this.isCollided = function(point, radius) {
      var angle = Math.abs(direction(this.position, point) - this.angle);
      return distance(this.position, point) < this.radius(angle) + radius;
    };
    
    this.nose = function() {
      return translatePosition(this.position, this.angle, LENGTH);
    };

  }
  
  window.SpaceRocks.Ship = Ship;

})();