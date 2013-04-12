var express = require('express');
var _ = require('underscore');

var app = express();

// Log requests in dev mode
app.use(express.logger('dev'));

// Serve static assets
app.use(express.static(__dirname + '/assets'));

// Be able to parse POST requests
app.use(express.bodyParser());

// Choose jade templating
app.set('view engine', 'jade');

/*
 * Example score:
 * { name: "XYX", score: 830 }
*/

global.highScores = [];

app.get('/', function(request, response) {
  response.render('layout', { highScores: global.highScores });
});

app.post('/scores', function(request, response) {
  global.highScores.push(request.body);
  var scores = _.sortBy(global.highScores, function(highScore) {
    return -highScore.score;
  });
  global.highScores = _.first(scores, 8);
  response.json(global.highScores);
});

var port = process.env.PORT || 5000;
app.listen(port);