(function(){
	var Game = window.SpaceRocks.Game;
	var wrap = wrapAround(Game.windowSize);

	var Asteroids = function(paper){

    console.log("Creating an asteroid");
    this.position = {x: Math.random() * Game.windowSize, y: Math.random()*Game.windowSize};
    this.angle = Math.floor(Math.random() * 360);
    //console.log(radius);
    this.MOVE_DISTANCE = 2;
    this.obj = paper.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z");
    //this.obj.scale(radius);
    //this.obj = paper.path('M' + (this.position.x) + ' ' + (this.position .y) + 'l' + 0 + ' ' + 10);

    this.updatePosition = function() {
      this.position.x += (Math.sin((this.angle * Math.PI / 180)) * this.MOVE_DISTANCE);
      this.position.y += (Math.cos((this.angle * Math.PI / 180) + Math.PI) * this.MOVE_DISTANCE);
      this.position.x = wrap(this.position.x);
      this.position.y = wrap(this.position.y);
      this.obj.transform("t" + (this.position.x) + "," + (this.position.y) + 'r' + this.angle);      
      //this.obj.animate(this.position.x, this.position.y);
      console.log(this.position);
    };
  }
  window.SpaceRocks.Asteroids = Asteroids;
			
})();