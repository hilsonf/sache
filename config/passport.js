var passport      = require('passport');
var user       = require('../models/user');
var LocalStrategy  = require('passport-local').Strategy;

  passport.use('local', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true},
  function(req, username, password, done) {
    process.nextTick(function () {
	  user.findOne({'username':username},
		function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Sorry no user found.'}); }
			if (!user.validPassword(password)) { return done(null, false, { message: 'Oops! Wrong password.'}); }

      return done(null, user);
		});
     
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
  });
});