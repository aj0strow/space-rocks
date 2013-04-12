(function() {
  
  // Convert radians -> degrees
  window.toDegrees = function(radians) {
    return radians * (180 / Math.PI);
  }
  
  // Convert degrees -> radians
  window.toRadians = function(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Higher order function that returns a new fn
  // Ex: 
  
  /* 
   * A Higher order fn that returns a new fn. Ex:
   *
   * var wrap = wrapAround(10)
   * wrap(-3)  ->  10
   * wrap(12)  ->  0
   * wrap(7)   ->  7
  */
  window.wrapAround = function(max) {
    var f = function(coord) {
      if (coord < -10) 
        coord = max;
      else if (coord > ( max + 10 ) ) 
        coord = 0;
      return coord;
    }
    return f;
  }

  window.distance = function(point1, point2){
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /*
   * The direction from one point to another. For example:
   *
   * direction (2,2), (2,1) = 0 deg
   * direction (2,2), (3,2) = 90 deg
  */
  window.direction = function(p1, p2) {
    return 180 - toDegrees( Math.atan2(p2.x - p1.x, p2.y - p1.y) );
  }
  
  window.translatePosition = function(point, angle, distance) {
    var ang = toRadians(angle);
    return {
      x: point.x + distance * Math.sin(ang),
      y: point.y - distance * Math.cos(ang)
    };
  }
  
  // Array Remove - By John Resig (MIT Licensed)
  
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  }

  window.SpaceRocks = {};
  
})();