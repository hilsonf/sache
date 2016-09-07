"use strict";
var express 	= require('express'),
    app = express(),
    http = require('http'),
    nodemailer = require("nodemailer"),
    passport = require('passport'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    exphbs  = require('express-handlebars'),
    mongoose = require('mongoose'),
    multer  = require('multer'),
    multerResizer = require('multer-resizer'),
    twilio = require('twilio'),
    helpers = require('./config/helpers'),
    bodyParser = require('body-parser');



  var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: helpers,
  defaultLayout: 'main'
  });

require('./config/passport')(passport); // pass passport for configuration

//view engine
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({ secret: 'zaina', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/routes')(app, passport, multer, multerResizer);

var port = process.env.PORT || 3000;

var server = app.listen(port, function(){
  console.log('Server Active On', port);
});

module.exports = server;

