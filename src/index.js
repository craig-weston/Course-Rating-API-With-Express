'use strict';

// Import statements
const express       = require('express');

// Import the route endpoints
const user          = require('./routes/users');
const courses       = require('./routes/courses');
// Import body parser and logger
const jsonParser    = require('body-parser').json;
const logger        = require('morgan');

const mongoose      = require('mongoose');

// Set up the express app
const app = express();

// set up the mongodb connection

mongoose.connect('mongodb://localhost:27017/course-rating-api');
const db = mongoose.connection

// handling mongo error
db.on('error', function(err) {
  console.error('connection error', err);
});

db.on('connected', function() {
    console.log('MongoDB: successfully connected');
});

db.on('disconnected', function() {
    console.log('MongoDB: disconnected');
});


//
  // The seed block is below
//

// const seeder = require('mongoose-seeder');
// const data = require('./data/data.json');
//
// db.once('open', function() {
//   seeder
//     .seed(data)
//     .catch(function(err) {
//       console.log(err);
//     })
// });


// Set up logger and body parser (for json encode)
app.use(logger('dev'));
app.use(jsonParser());

// Set up the router and both entry points
app.use('/api/users', user);
app.use('/api/courses', courses);

// Catching up 404 erros
app.use(function (req, res, next) {
  const err = new Error('Not found!');
  err.status = 404;
  next(err);
});

// Error Handler
app.use(function (err, req, res, next) {
  res.status(err.status  || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Set up the port
const port = process.env.PORT || 5000;

// Running the app
app.listen(port, function () {
  console.log('Magic Happens on port', port);
});
