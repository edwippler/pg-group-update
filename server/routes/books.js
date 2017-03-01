var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = {
  database: 'phi', // the name of the database
  host: 'localhost', // where is your database
  port: 5432, // the port number for your database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);


router.get('/', function(req, res){
  // This will be replaced with a SELECT statement to SQL
  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('SELECT * FROM "books";', function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/new', function(req, res){
  // This will be replaced with an INSERT statement to SQL
  var newBook = req.body;

  pool.connect(function(errorConnectingToDatabase, client, done){
    if(errorConnectingToDatabase) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' git stuff!!!!!
      client.query('INSERT INTO books (title, author, edition, publisher) VALUES ($1, $2, $3, $4);',
      [newBook.title, newBook.author, newBook.edition, newBook.publisher],
      function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making the database query: ', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

// -> /delete/43 (idOfBookToDelete)

router.delete('/delete/:id', function(req, res) {  // ':' tells us we're looking for an optional parameter (can have multiple optional
  var bookId = req.params.id; // req.params = optional parameters -- '.id' matches optional parameter in url (/delete/:id) -- will almost always only pass id this way
  // SELECT * FROM "books" WHERE "id" = 43;

  console.log('books of id to delete: ', bookId);
  // connecting to, and deleting row from the database
  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' delete stuff!!!!!
      client.query('DELETE FROM "books" WHERE "id" = $1;', [bookId], function(err, result){
        done();
        if(err) {
          console.log('Error making the database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // end router.delete

router.put('/save/:id', function(req, res) {  // ':' tells us we're looking for an optional parameter (can have multiple optional
  var bookId = req.params.id; // req.params = optional parameters -- '.id' matches optional parameter in url (/delete/:id) -- will almost always only pass id this way
  var bookObject = req.body;
  console.log('books of id to save: ', bookId);
  // connecting to, and deleting row from the database
  pool.connect(function(err, client, done){
    if(err) {
      // There was an error connecting to the database
      console.log('Error connecting to database: ', err);
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now, we're gonna' save stuff!!!!!
      client.query('UPDATE "books" SET "title"= $1, "author" = $2, "edition" = $3, "publisher" = $4 WHERE "id" = $5;', [bookObject.title, bookObject.author, bookObject.edition, bookObject.publisher, bookId], function(err, result){
        done();
        if(err) {
          console.log('Error making the database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
}); // end route.put

module.exports = router;
