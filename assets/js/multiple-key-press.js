(function() {
  
  var keys = {};

$(document).keydown(function (e) {
    keys[e.which] = true;
    
    printKeys();
});

$(document).keyup(function (e) {
    delete keys[e.which];
    
    printKeys();
});

function printKeys() {
    var html = '';
    for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;
        html += '<p>' + i + '</p>';
    }
    $('#out').html(html);
}

})();
