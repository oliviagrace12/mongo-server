var express = require('express');
var path = require('path');
var logger = require('morgan');

require('dotenv').config();
// import and invoke the function   
require('./models/setupMongo')();

var authRouter = require('./routes/auth');
var itemRouter = require('./routes/item');
var themeRouter = require('./routes/theme');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/item', itemRouter);
app.use('/theme', themeRouter);

module.exports = app;
