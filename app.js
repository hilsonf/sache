"use strict";
var express 	  = require('express'),
    app           = express(),
    http          = require('http'),
    nodemailer    = require("nodemailer"),
    passport      = require('passport'),
    flash         = require('connect-flash'),
    session       = require('express-session'),
    exphbs        = require('express-handlebars'),
    helpers       = require('./config/helpers'),
    mongoose      = require('mongoose'),
    multer        = require('multer'),
    bodyParser    = require('body-parser');


//Helpers and default layout
var hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: 'main'
});

//pasport Configuration
require('./config/passport'); 

//view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Static Folders
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads',express.static(__dirname + '/uploads'));
//Global User
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//Body Parser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Pasport Sessions
app.use(session({ secret: 'zaina', saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
require('./routes/routes')(app, passport, multer);

var port = process.env.PORT || 3000;

var server = app.listen(port, function(){
  console.log('Server Active On', port);
});

module.exports = server;

