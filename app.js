var express = require('express');

var app = express();

// Log requests in dev mode
app.use(express.logger('dev'));

app.get('/', function(request, response) {
  response.write("hello world");
  response.end();
});

var port = process.env.PORT || 5000;
app.listen(port);

console.log("Application launched and listening on port " + port);
