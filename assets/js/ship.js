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
    this.position = { x: Game.windowSize / 2, y: Game.windowSize / 2, };
    
    // the angle the ship points
    this.angle = -45;
    this.anglechange = 0;
    // the angle the ship moves
    // this.direction = -45;

    this.ANGLE_DELTA_INCREMENT = 2.5;
    this.ACCELERATION = 2;
    this.MAX_SPEED = 16;
    this.MOVE_DISTANCE = .5;
    
    this.updateAngle = function() {
      this.obj.rotate(this.anglechange);
      this.angle = (this.angle + this.anglechange) % 360;
      //console.log("angle is: " + (this.angle + 45));
      this.anglechange=0;
    };
    
    this.updatePosition = function() {
      /*
      var bbox = this.obj.getBBox();
      this.position.x = (bbox.x + bbox.width / 2) % Game.windowSize;
      this.position.y = (bbox.y + bbox.height / 2) % Game.windowSize;

      console.log("ship center: "+ bbox.x + bbox.width / 2 +" , "+bbox.y + bbox.height / 2);  */

      this.position.x += (Math.cos((this.angle - 45) * Math.PI / 180) * this.speed * this.MOVE_DISTANCE);
      this.position.y += (Math.sin((this.angle - 45) * Math.PI / 180) * this.speed * this.MOVE_DISTANCE);

      this.position.x = wrap(this.position.x);
      this.position.y = wrap(this.position.y);
            
      //console.log('Ship position: (' + this.position.x + ', ' + this.position.y + ')');

      this.obj.transform("t" + (this.position.x) + "," + (this.position.y) + "r" + this.angle);
      
      // Wrap around if it goes off left or right
      //this.position.x = wrap(this.position.x);
      //this.position.y = wrap(this.position.y);
    };
    
    this.update = function() {
      console.log("updataing ship");
      this.updateAngle();
      this.updatePosition();
    };

  }
  
  window.SpaceRocks.Ship = Ship;

})();