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

// Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
    }

  window.SpaceRocks = {};
  
})();