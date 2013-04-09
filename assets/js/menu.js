$(function() {
  
  var Game = window.SpaceRocks.Game;
  var TwoPlayerGame = window.SpaceRocks.TwoPlayerGame;
  // IDs for menu are in views/menu.jade
  
  $('#new-game').click(function() {
    Game.restart();
  });
  
  $('#two-player-game').click(function() {
    TwoPlayerGame.restart();
    console.log('Two Player');
  });
  
  $('#high-scores').click(function() {
    console.log('High Score');
    console.log('This is a stub. Replace the logic eventually in assets/js/ui-handlers/js');
  });
  
  $('#proceed').click(function() {
    console.log('Proceed');
    console.log('This is a stub. Replace the logic eventually in assets/js/ui-handlers/js');
  });
  
  $('#exit').click(function() {
    Game.resume();
  });
    
});