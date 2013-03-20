// Global game object for the client. Attach all classes to this game object. 

var Game = function() {};


window.Game = Game;

Game.window_size = 500;
Game.number_of_asteroids=10;
Game.fps=25;
// Global object Ship, part of game (can be changed) and controlled by the player
var Ship = {};
Ship.obj; //the actual ship drawn in Raphael. All transformations are done here
//Variables
Ship.velocty=0;
// The ship's x and y coordinates
Ship.position_x=250;
Ship.position_y=250;
Ship.speed=0;
/* The angle the ship is facing. -45 is straight because the graphic 
 * available on the raphael website was made to face 45 deg angle
 * Rapahel uses degrees while Math. use radians, so either we have to
 * switch between the two regardless  */
Ship.angle=-45;
//Global contants:

//object asteroids
var Asteroid = {};
Asteroid._size;
//An array containing all Asteroid in the field 
Game.Asteroids = [];

//object bullet
var Bullet={}
//An array containing all Bullets in the field 
Game.Bullets=[];

var drift_velocity=0;       //can't implement right now
var velocity_increment=1.5;
var max_velocity=Math.pow(velocity_increment,4); //muliple of velocity_increment
var px = 1;             //distance moved on up/down arrow
var d_angle=5;          //angle change on left right arrow
var angle=0;
var k = Math.PI/180;    //conversion factor to radians

window.onload=newGame;  //excecutes new game function when called

function newGame() {
  //creates the canvas of defined size.
    Game.paper = new Raphael(document.getElementById('canvas_container'),Game.window_size , Game.window_size);
    //creates a ship on the paper. The String is the vector coordinates drawn by Raphael
    Ship.obj=Game.paper.path("M 15.834,29.084 15.834,16.166 2.917,16.166 29.083,2.917z")
    //defines the properties of the ship
    Ship.obj.attr(   
     {
              stroke: '#3b4449',    
              'stroke-width': 1,    
              'stroke-linejoin': 'sharp',
              "transform":("t"+Game.window_size/2+","+Game.window_size/2+"r"+-45)
     });
    //console.log("onCreate ["+Ship.position_x+", "+Ship.position_y+"]");
}

setInterval(gameLoop, 1000/Game.fps)  //1000ms*frames/s=frames
function gameLoop(){
  updatePosition(Ship);
  updateAngle(Ship);
  //Ship.obj.animate({"transform":"t"+(Ship.position_x+px*Ship.speed*Math.sin(Ship.angle*k))+","+(Ship.position_y+Math.cos(Ship.angle*k))+"r"+Ship.angle});
  /*for(a in asteroids)
    a.transform(....)
    for(b in bullets)
    b.transform(..._)

    etc..
  */

  console.log(Ship.speed+","+Ship.angle+", ["+Ship.position_x+", "+Ship.position_y+"]");
}

function updatePosition(Obj){ //gives the location of the sent object (should be used for asteroids and bullets too)
  var bbox=Obj.obj.getBBox();
  Obj.obj.position_x+=(bbox.x+bbox.width/2)%(Game.window_size);      //gets x-center of object
  Obj.obj.position_y+=(bbox.y+bbox.height/2)%(Game.window_size);     //gets y-center of object

  //console.log("test 1 ["+Ship.position_x+", "+Ship.position_y+"]");

  if(Obj.position_x<0){                                            //allows for wrapping
    Obj.position_x=Game.window_size;
  }

  if(Obj.position_y<0){
    Obj.Obj.position_y=Game.window_size;
  }
console.log("test 2 ["+Ship.position_x+", "+Ship.position_y+"]");
}

function updateAngle(Obj){
  Obj.obj.rotate(angle);
  Obj.angle=(Obj.angle+angle)%360;
  angle=0;
}

$(document).keydown(function(e){    
    if (e.keyCode == 38) {                            //when up is pressed
        if(Ship.speed==drift_velocity||Ship.speed==0)  //makes it move if still
          Ship.speed=1;                  
        else if(Ship.speed<max_velocity)         //accelerates if not at max speed
          Ship.speed*=velocity_increment;
    }
    else if (e.keyCode == 40) {                       //when down arrow is pressed
          if(Ship.speed<=1){          
              Ship.speed=drift_velocity;         //the slow speed the ship drifts at
            }
          else Ship.speed/=velocity_increment;                              //halves speed if button is pressed
    }
    else if(e.keyCode == 37){                         //left arrow press
      angle=angle-d_angle;
    }
    else if(e.keyCode==39){                           //right arrow press
      angle+=d_angle;
    }
    else if(e.keyCode==13){
      console.log("misc debugging");
    }
    else if(e.keyCode==16)                        //debugging, excecutes through gameloop once each press of shift
      gameLoop();
    return false;
});

