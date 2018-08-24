'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonParser = require('body-parser').json;
const seeder = require('mongoose-seeder'),
  data = require('./data/data.json');

const courses = require('./routes/courses');
const users = require('./routes/users');

const app = express();

mongoose.connect("mongodb://localhost:27017/courseRating")
var db = mongoose.connection;

db.on("error", err => {
  console.error("connection error:", err);
});


db.once("open", () => {
  console.log("db connection sucessful");
  seeder.seed(data, {}, () => {
    console.log("Data seeded");
  }).then(dbData => {
    // The database objects are stored in dbData
  }).catch(err => {
    console.log(err);
  });
});

app.set('port', process.env.PORT || 5000);

app.use(morgan('dev'));
app.use(jsonParser());

app.use('/', express.static('public'));

app.use('/api/users', users);
app.use('/api/courses', courses);

app.use((req, res, next) => {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err);
});

var server = app.listen(app.get('port'), () => {
  console.log('Express server is listening on port ' + server.address().port);
});
