(function() {
  
 var log = $('#log')[0],
    pressedKeys = [];

$(document.body).keydown(function (evt) {
    var li = pressedKeys[evt.keyCode];
    if (!li) {
        li = log.appendChild(document.createElement('li'));
        pressedKeys[evt.keyCode] = li;
    }
    $(li).text('Down: ' + evt.keyCode);
    $(li).removeClass('key-up');
});

$(document.body).keyup(function (evt) {
    var li = pressedKeys[evt.keyCode];
    if (!li) {
       li = log.appendChild(document.createElement('li'));
    }
    $(li).text('Up: ' + evt.keyCode);
    $(li).addClass('key-up');
});

})();
