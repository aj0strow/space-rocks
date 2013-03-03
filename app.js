var express = require('express');

var app = express();

// Log requests in dev mode
app.use(express.logger('dev'));

// Serve static assets
app.use(express.static(__dirname + '/assets'));

// Choose jade templating
app.set('view engine', 'jade');


app.get('/', function(request, response) {
  response.render('layout');
});

var port = process.env.PORT || 5000;
app.listen(port);

console.log("Application launched and listening on port " + port);
