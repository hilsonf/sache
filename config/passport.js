
var user       = require('../models/user');
var LocalStrategy  = require('passport-local').Strategy;


module.exports = function(passport) {

  passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true},
  function(req, username, password, done) {
    process.nextTick(function () {
	  user.findOne({'username':username},
		function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'You have entered a wrong user name'}); }
			if (!user.validPassword(password)) { return done(null, false, { message: 'You have entered the wrong password'}); }

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


}