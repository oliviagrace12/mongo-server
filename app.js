var express = require('express');
var path = require('path');
var logger = require('morgan');

var itemRouter = require('./routes/item');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

module.exports = app;
