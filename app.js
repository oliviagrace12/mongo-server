var express = require('express');
var path = require('path');
var logger = require('morgan');

require('dotenv').config();
// import and invoke the function   
require('./models/setupMongo')();

var itemRouter = require('./routes/item');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/item', itemRouter);

module.exports = app;
