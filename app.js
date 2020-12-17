var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// modal engine setup
const mongoClient = require('mongodb').mongoClient;
const assert = require('assert');

const mongoose = require('mongoose');//telah ditambahkan
const { MongoClient } = require('mongodb');

// connect Url
var url = 'mongodb://localhost:27017';
mongoose.connect('mongodb://localhost:27017:"/"/breaddb');//telah ditambahkan

// name database
const namedb = 'breaddb';

// use connect method to connect server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err)
  console.log("koneksi ke server sukses!!!");

  const db = client.db(namedb);

  var indexRouter = require('./routes/index')(db);

  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });


  // error handler
  app.use(function (err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
})
module.exports = app;
