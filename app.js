"use strict"

const create_error = require('http-errors');
const express = require('express');
const path = require('path');
const cookie_parser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const routes = require('./routes/index');
const app = express();
const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(cookie_parser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true,
  parameterLimit: 50000
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(create_error(404));
});

// error handler
app.use(function (error, req, res, next) {
  console.log("ERROR ~ error:", error)

  let statusCode = error.status || 500;
  let errorMessage = error.message

  if (error.name === "ValidationError") {
    statusCode = 400; 
    errorMessage = "Validation error: " + error.message;
  } else if (error.name === "UnauthorizedError") {
    statusCode = 401; 
    errorMessage = "Unauthorized access";
  } else if (error.name === "NotFoundError") {
    statusCode = 404; 
    errorMessage = "Resource not found";
  }
  
  res.status(statusCode).json({
    status: false,
    message: errorMessage,
  });
});

module.exports = app;
