var mongoose    		= require('mongoose');
    mongoose.Promise 	= require('bluebird');
var bodyParser 			= require('body-parser');
var bcrypt   			= require('bcrypt-nodejs');
var Schema   			= mongoose.Schema;
   
var userSchema = new mongoose.Schema({
    username: 	  String,
    password:     String
});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);











