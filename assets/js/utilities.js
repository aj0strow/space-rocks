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
    var xs = 0;
    var ys = 0;
 
    xs = point2.x - point1.x;
    xs = xs * xs;
 
    ys = point2.y - point1.y;
    ys = ys * ys;
 
  return Math.sqrt( xs + ys );
  }

// Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
    }

  window.SpaceRocks = {};
  
})();