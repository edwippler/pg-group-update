console.log('Starting up the server');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var books = require('./routes/books');
var port = 5000;

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({extended: true})); // this creates req.body

app.use('/books', books);

app.listen(port, function() {
  console.log('We are running on port: ', port);
});
